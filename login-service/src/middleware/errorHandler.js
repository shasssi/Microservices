const logger = require("../utils/logger");

const errorHandler = async (err, req, res, next) => {
    console.log("errorHandler", err)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  logger.error("statusCode: " + statusCode + " " + "message: " + message);
  // logger.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message,
    // stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
