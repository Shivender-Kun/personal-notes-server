import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging purposes

  const isProduction = process.env.NODE_ENV === "production";
  // Check if the error has a status code, otherwise default to 500
  const statusCode = err.status || 500;

  // If the error is an instance of Error, we can use its message
  const message =
    err.errorMessage || err.message || "An unexpected error occurred";

  // If in production, do not expose stack trace
  const stack = isProduction ? undefined : err.stack || err.stackTrace;

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }), // Include stack trace only if available and not in production
  });
};

export default errorHandler;
// This middleware function handles errors that occur in the application.
