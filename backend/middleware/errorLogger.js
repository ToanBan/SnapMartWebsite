const { ErrorLog } = require("../models");

const errorLogger = async (err, req, res, next) => {
  try {
    await ErrorLog.create({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      statusCode: err.status || 500,
      userId: req.user?.id || null,
      payload: req.body,
    });
  } catch (error) {
    console.error("Failed to save error log", error);
  }

  next(err);
};

module.exports = errorLogger;
