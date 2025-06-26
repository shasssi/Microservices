const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQ: 429,
  INTERNAL_ERROR: 500,
};

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates expected errors
    Error.captureStackTrace(this, this.constructor);
  }
}

// 500 - internal server error
class APIError extends CustomError {
  constructor(
    message = "Internal Server Error",
    statusCode = STATUS_CODES.INTERNAL_ERROR
  ) {
    super(message, statusCode);
  }
}

// 400 - bad request
class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, STATUS_CODES.BAD_REQUEST);
  }
}

// 401, 403
class AuthorizationError extends CustomError {
  constructor(message = "user unauthorized") {
    super(message, STATUS_CODES.UN_AUTHORISED);
  }
}

module.exports = { BadRequestError, APIError, AuthorizationError };
