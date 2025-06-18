import { NextFunction, Request, Response } from "express";
import { CustomErrorHandler, Token } from "../services";
import csurf from "csurf";
import { StatusCodes } from "http-status-codes";

const csrfProtection = csurf({ cookie: true });

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

      // Apply CSRF protection only if user is authenticated
      csrfProtection(req, res, (err) => {
        if (err) {
          // Handle CSRF error, e.g. invalid or missing token
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: "Invalid CSRF token" });
        }
        next();
      });
    }
  } catch (error) {
    next(error);
  }
};

export default authHandler;
// This middleware function checks if the request has a valid JWT token in the Authorization header.
