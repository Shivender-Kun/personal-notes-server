import { StatusCodes } from "http-status-codes";

class CustomErrorHandler extends Error {
  public readonly status: number;
  public readonly errorMessage: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.errorMessage = message;
  }

  static alreadyExists(message: string) {
    return new CustomErrorHandler(StatusCodes.CONFLICT, message);
  }

  static wrongCredentials(message = "Username or password is incorrect") {
    return new CustomErrorHandler(StatusCodes.UNAUTHORIZED, message);
  }

  static unauthorized(message = "Unauthorized access") {
    return new CustomErrorHandler(StatusCodes.UNAUTHORIZED, message);
  }

  static notFound(message = "Resource not found") {
    return new CustomErrorHandler(StatusCodes.NOT_FOUND, message);
  }

  static badRequest(message = "Bad request") {
    return new CustomErrorHandler(StatusCodes.BAD_REQUEST, message);
  }

  static serverError(message = "Internal server error") {
    return new CustomErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }

  static forbidden(message = "Forbidden access") {
    return new CustomErrorHandler(StatusCodes.FORBIDDEN, message);
  }

  static customError(status: number, message: string) {
    return new CustomErrorHandler(status, message);
  }
}

export default CustomErrorHandler;
