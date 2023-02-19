import { Request, Response } from "express";
import httpStatus from "http-status";
import { findUserByEmailAndPassword, registerUser } from "../user/user.service";
import { IUserDoc } from "../user/user.interfaces";
import { generateToken } from "./auth.service";

/**
 * Register a new user
 * @param req Request
 * @param res Response
 * @returns json
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, string>>> => {
  const { name, email, password } = req.body;

  try {
    const data = await registerUser({ name, email, password });
    return res.status(httpStatus.CREATED).json(generateToken(data));
  } catch (error) {
    return res
      .status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * Validate the credentials to provide an authentication token
 * @param req Request
 * @param res Response
 * @returns json
 */
export const login = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, string>>> => {
  const { email, password } = req.body;

  try {
    const user: IUserDoc = await findUserByEmailAndPassword(email, password);
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Incorrect email or password" });
    }
    return res.json(generateToken(user));
  } catch (error) {
    return res
      .status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
