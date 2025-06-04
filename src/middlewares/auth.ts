import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler, Token } from "../services";

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token =
    (authHeader && authHeader.split(" ")[1]) || req.cookies.auth_token;

  if (!token)
    return CustomErrorHandler.unauthorized(
      "Unauthorized access! No token provided."
    );

  try {
    const validateToken = Token.verify(token);

    if (typeof validateToken !== "string") {
      res.locals.userId = validateToken.id;
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default authHandler;
// This middleware function checks if the request has a valid JWT token in the Authorization header.
