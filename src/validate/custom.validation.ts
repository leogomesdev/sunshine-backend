import { CustomHelpers } from "joi";
import constants from "../config/constants";
/**
 * Custom validation for password
 * @param value 
 * @param helpers 
 * @returns value
 */
export const password = (value: string, helpers: CustomHelpers) => {
  if (!constants.regex.password.length.test(value)) {
    return helpers.message({
      custom: `password must be at least 12 characters long`,
    });
  }
  if (!constants.regex.password.general.test(value)) {
    return helpers.message({
      custom:
        "password must contain at least 1 uppercase letter, 1 number, and 1 special character",
    });
  }
  return value;
};
