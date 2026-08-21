const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(". ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists`;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
