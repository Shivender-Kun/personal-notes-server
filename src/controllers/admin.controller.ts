import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomErrorHandler, Token } from "../services";
import { StatusCodes } from "http-status-codes";
import Hashing from "../services/hashUtility";
import { ADMIN_SECRET_KEY } from "../config";
import { Admin } from "../models";

const registerAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const adminExists = await Admin.get(email);

    // If admin exists, verify the password and return the auth_token
    if (adminExists) {
      const verifyPassword = await Hashing.validate(
        password,
        adminExists.password as string
      );

      // If password is verified, generate the auth_token and return it in the response
      if (verifyPassword) {
        const token = Token.generate({ id: adminExists._id });

        return res.status(StatusCodes.OK).json({
          message: "Admin created successfully",
          auth_token: token,
        });
      }
    }

    return next(CustomErrorHandler.wrongCredentials("Invalid credentials!"));
  } catch (error) {
    next(error);
  }
};

const loginAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, secret } = req.body;

  try {
    if (secret !== ADMIN_SECRET_KEY) return CustomErrorHandler.badRequest();

    const adminExists = await Admin.get(email);

    // If admin exists, return an error response
    if (adminExists)
      return next(
        CustomErrorHandler.alreadyExists(
          "Admin with this email already exists!"
        )
      );

    // If admin does not exist, create a new admin
    const admin = await Admin.create({ email, password });

    if (admin)
      res.status(StatusCodes.CREATED).json({
        message: "Admin created successfully",
      });
  } catch (error) {
    next(error);
  }
};

export default { registerAdmin, loginAdmin };
