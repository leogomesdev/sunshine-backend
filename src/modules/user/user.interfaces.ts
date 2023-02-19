import mongoose, { Model, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IValidRegisterUserBody {
  name: string;
  email: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}