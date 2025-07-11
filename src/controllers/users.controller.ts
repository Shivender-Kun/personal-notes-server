import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomErrorHandler, Hash, Token } from "../services";
import { StatusCodes } from "http-status-codes";
import Hashing from "../services/hashUtility";
import { User } from "../models";
import { generateResetToken } from "../services/generateResetToken";
import { sendResetMail } from "../utils/mailer";

const isDevelopment = process.env.NODE_ENV === "development";

const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = {
    email: (req.body.email as String).toLowerCase().trim(),
    password: req.body.password,
    profilePicture: req.body.profilePicture.trim(),
    username: "",
  };
  userData.username = userData.email.split("@")[0]; // Extract username from email

  try {
    const user = await User.get({ email: userData.email });

    // If user exists, return an error response with status code 409
    if (user)
      return next(CustomErrorHandler.alreadyExists("Account already exists!"));

    const newUser = await User.create(userData); // Create a new user in the database

    if (newUser)
      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully!",
      });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to register user, please try again",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const csrfToken = req.csrfToken(); // Get CSRF token from the request

  const { email, password } = req.body;

  try {
    const user = await User.get({ email }); // Check if user exists in the database

    // If user exists, verify the password and return the auth_token
    if (user) {
      const verifyPassword = await Hashing.validate(password, user.password);

      // If password is verified, generate the auth_token and return it in the response
      if (verifyPassword) {
        const token = Token.generate({ id: user._id }, "1d"); // Generate a token valid for 1 day

        const userData = JSON.stringify({
          username: user.username,
          coverPicture: user.coverPicture,
          profilePicture: user.profilePicture,
        });

        return res
          .cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            ...(!isDevelopment && { domain: ".shivender.pro" }), // ✅ enables subdomain sharing
          })
          .cookie("user", userData, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            ...(!isDevelopment && { domain: ".shivender.pro" }), // ✅ enables subdomain sharing
          })
          .cookie("csrf_token", csrfToken, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            ...(!isDevelopment && { domain: ".shivender.pro" }), // ✅ enables subdomain sharing
          })
          .status(StatusCodes.OK)
          .json({
            message: "Logged in successfully",
          });
      }
    }

    return next(CustomErrorHandler.wrongCredentials());
  } catch (error) {
    next(error);
  }
};

const userDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This function handles the request to get the user profile
  const { userId } = res.locals;

  try {
    const user = await User.get({ id: userId });

    if (user)
      return res.status(StatusCodes.OK).json({
        message: "Profile fetched successfully",
        user,
      });

    return next(CustomErrorHandler.badRequest());
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = res.locals;
  const { username, coverPicture, profilePicture } = req.body;

  try {
    const updateProfile = await User.update(userId, {
      username: username.trim(),
      coverPicture,
      profilePicture,
    });

    if (updateProfile)
      return res.status(StatusCodes.OK).json({
        message: "Profile updated successfully",
      });

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      ...(!isDevelopment && { domain: ".shivender.pro" }),
    })
    .clearCookie("user", {
      secure: true,
      sameSite: "none",
      ...(!isDevelopment && { domain: ".shivender.pro" }),
    })
    .cookie("csrf_token", {
      sameSite: "none",
      secure: true,
      ...(!isDevelopment && { domain: ".shivender.pro" }), // ✅ enables subdomain sharing
    })
    .status(StatusCodes.OK)
    .json({ message: "Logged out succesfully" });
};

const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.get({ email: email.toLowerCase().trim() });

    if (user) {
      const token = generateResetToken();

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
      await user.save();

      const mailId = await sendResetMail(user.email, user.username, token);

      if (mailId)
        return res.status(StatusCodes.OK).json({
          mailId,
          email: user.email,
          message: "A password reset link has been sent.",
        });
    }
    return next(CustomErrorHandler.notFound("User not found"));
  } catch (error) {
    next(error);
  }
};

const resetPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, token } = req.body;

  try {
    const user = await User.get({ resetPasswordToken: token });

    if (user) {
      const tokenExpiry = user.resetPasswordExpires;

      const isTokenExpired = Date.now() > tokenExpiry!;
      if (isTokenExpired) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Link expired. Please request a new reset link" });
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.status(StatusCodes.OK).json({
        message: "Password reset succesfully",
      });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Invalid link. Please request a new reset link" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteAccount: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = res.locals;

  try {
    const updateProfile = await User.update(userId, {
      isDeleted: true,
    });

    if (updateProfile)
      return res.status(StatusCodes.OK).json({
        message: "Profile deleted successfully",
      });

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  userDetails,
  updateUser,
  logoutUser,
  deleteAccount,
  resetPassword,
  forgotPassword,
};
