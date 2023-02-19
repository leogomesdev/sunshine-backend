import httpStatus from "http-status";
import bcrypt from "bcrypt";
import User from "./user.model";
import { IValidRegisterUserBody, IUserDoc } from "./user.interfaces";
import { ApiError } from "../../errors";
import constants from "../../config/constants";

/**
 * Create a new user
 * @param userBody p=user properties
 * @returns created user
 */
export const registerUser = async (
  userBody: IValidRegisterUserBody
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, "Email already taken");
  }

  const salt: string = bcrypt.genSaltSync(constants.password.saltRounds);
  const hashedPassword: string = bcrypt.hashSync(userBody.password, salt);
  const user: IUserDoc = new User({
    name: userBody.name,
    email: userBody.email,
    password: hashedPassword,
  });
  await user.save();
  return user;
};

/**
 * Find the user and check if password matches
 * @param email string
 * @param password string
 * @returns boolean
 */
export const findUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<IUserDoc> => {
  const user: IUserDoc = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch: boolean = await user.isPasswordMatch(password);
  if (!isMatch) {
    return null;
  }
  return user;
};
