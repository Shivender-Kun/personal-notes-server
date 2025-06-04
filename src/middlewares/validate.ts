import { CustomErrorHandler } from "../services";
import Joi from "joi";

const validate =
  (schema: Joi.ObjectSchema) => (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body); // Validate the request body against the schema
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");

      // If validation fails, return an error response with status code 400
      return next(
        CustomErrorHandler.badRequest(`Validation failed: ${message}`)
      );
    }

    next(); // If validation passes, continue to the next middleware or route handler
  };

export default validate;
// This middleware function is used to validate incoming requests against a Joi schema.
// If the validation fails, it sends a 400 Bad Request response with the validation error message.
