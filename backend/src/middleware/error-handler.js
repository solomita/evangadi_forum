import multer from "multer";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  // NEW: Handle Multer specific errors globally
  if (err instanceof multer.MulterError) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    if (err.code === "LIMIT_FILE_SIZE") {
      customError.msg = "File too large. Maximum size is 10MB.";
    } else {
      customError.msg = err.message;
    }
  }
  if (err?.code === "ER_DUP_ENTRY") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = "Duplicate value entered for a unique field";
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};
