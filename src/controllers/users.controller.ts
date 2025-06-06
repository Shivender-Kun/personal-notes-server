import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomErrorHandler, Token } from "../services";
import { StatusCodes } from "http-status-codes";
import Hashing from "../services/hashUtility";
import { User } from "../models";

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
    const userExists = await User.get(userData.email);

    // If user exists, return an error response with status code 409
    if (userExists)
      return next(CustomErrorHandler.alreadyExists("Account already exists!"));

    const user = await User.create(userData); // Create a new user in the database

    if (user)
      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully!",
      });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to register user, please try again later.",
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
    const userExists = await User.get(email); // Check if user exists in the database

    // If user exists, verify the password and return the auth_token
    if (userExists) {
      const verifyPassword = await Hashing.validate(
        password,
        userExists.password
      );

      // If password is verified, generate the auth_token and return it in the response
      if (verifyPassword) {
        const token = Token.generate({ id: userExists._id }, "1d"); // Generate a token valid for 1 day

        const userData = JSON.stringify({
          username: userExists.username,
          coverPicture: userExists.coverPicture,
          profilePicture: userExists.profilePicture,
        });

        return res
          .cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            // domain: ".shivender.pro", // ✅ enables subdomain sharing
          })
          .cookie("user", userData, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            // domain: ".shivender.pro", // ✅ enables subdomain sharing
          })
          .cookie("csrf_token", csrfToken, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            // domain: ".shivender.pro", // ✅ enables subdomain sharing
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
    const user = await User.get("", userId);

    if (user)
      return res.status(StatusCodes.OK).json({
        message: "Profile fetched successfully",
        user,
      });

    console.log(user);

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
      username,
      coverPicture,
      profilePicture,
    });

    if (updateProfile)
      return res.status(StatusCodes.OK).json({
        message: "Profile updated successfully",
        data: {
          email: updateProfile.email,
          username: updateProfile.username,
          coverPicture: updateProfile.coverPicture,
          profilePicture: updateProfile.profilePicture,
        },
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
      domain: ".shivender.pro",
    })
    .clearCookie("user", {
      secure: true,
      sameSite: "none",
      domain: ".shivender.pro",
    })
    .status(StatusCodes.OK)
    .json({ message: "Logged out succesfully" });
};

export default {
  registerUser,
  loginUser,
  userDetails,
  updateUser,
  logoutUser,
};
