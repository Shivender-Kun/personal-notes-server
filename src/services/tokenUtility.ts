import { JWT_SECRET } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const Token = {
  // Replace JWT_SECRET with your own secret key
  secret: JWT_SECRET,

  // Generate a JWT token with the given payload and optional expiration time
  generate(payload: any, expiresIn = "60s"): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  },

  // Verify the JWT token and return the payload if it's valid, otherwise throw an error
  verify(token: string): string | JwtPayload {
    return jwt.verify(token, this.secret);
  },
};

export default Token;
