import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const Token = {
  // Generate a JWT token with the given payload and optional expiration time
  generate(
    payload: string | object | Buffer,
    expiresIn: SignOptions["expiresIn"] = "60s"
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  // Verify the JWT token and return the payload if it's valid, otherwise throw an error
  verify(token: string): string | JwtPayload {
    return jwt.verify(token, JWT_SECRET);
  },
};

export default Token;
