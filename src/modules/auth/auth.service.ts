import jwt from "jsonwebtoken";
import config from "../../config/config";
import { IUserDoc } from "../user/user.interfaces";

/**
 * Create a new JWT token for the user
 * @param user User found by Mongoose
 * @returns created token
 */
export const generateToken = (user: IUserDoc): any => {
  const token = jwt.sign({ userId: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpirationMinutes * 60,
  });
  return { token };
};
