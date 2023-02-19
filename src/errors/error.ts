import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "./api-error";

/**
 * Handler errors to response on the expected format
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    err.statusCode ||
    (res.statusCode !== httpStatus.OK
      ? res.statusCode
      : httpStatus.INTERNAL_SERVER_ERROR);
  return res.status(statusCode).json({
    message: err.message,
  });
};
