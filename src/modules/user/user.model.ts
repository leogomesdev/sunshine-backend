import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDoc, IUserModel } from "./user.interfaces";

/**
 * Mongoose schema for User
 */
const userSchema = new Schema<IUserDoc, IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

/**
 * Check if email is already in use (before creating User instance)
 */
userSchema.static(
  "isEmailTaken",
  async function (email: string): Promise<boolean> {
    const user: IUserDoc = await this.findOne({ email });
    return !!user;
  }
);

/**
 * Allow the user object to call isPasswordMatch
 */
userSchema.method(
  "isPasswordMatch",
  async function (password: string): Promise<boolean> {
    const user: IUserDoc = this;
    return bcrypt.compare(password, user.password);
  }
);

const User: IUserModel = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
