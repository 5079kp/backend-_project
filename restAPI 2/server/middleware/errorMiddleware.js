
const errorHandler = (err, req, res, next) => {
  // Fixed: Initialize status code properly
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  
  // Fixed: Handle specific Mongoose errors
  
  // 1. CastError - Invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
  
  // Fixed: 2. Duplicate key error (MongoDB)
  if (err.code === 11000) {
    statusCode = 400;
    // Fixed: Extract the duplicate field name
    const field = Object.keys(err.keyPattern)[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }
  
  // Fixed: 3. Validation errors (Mongoose)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Fixed: Combine all validation error messages
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(". ");
  }
  
  // Fixed: 4. JSON Web Token errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }
  
  // Fixed: 5. Token expiration error
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }
  
  // Fixed: 6. Unauthorized error (custom)
  if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized access";
  }
  
  // Fixed: 7. Forbidden error (custom)
  if (err.name === "ForbiddenError") {
    statusCode = 403;
    message = "Access forbidden";
  }
  
  // Fixed: 8. Rate limit error
  if (err.name === "RateLimitError") {
    statusCode = 429;
    message = "Too many requests. Please try again later.";
  }
  
  // Fixed: 9. Handle specific HTTP errors
  if (err.name === "NotFoundError") {
    statusCode = 404;
    message = err.message || "Resource not found";
  }
  
  // Fixed: 10. Handle payment errors
  if (err.name === "PaymentError") {
    statusCode = 402;
    message = err.message || "Payment processing failed";
  }
  
  // Fixed: Log error for debugging
  if (process.env.NODE_ENV !== "production") {
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode,
      timestamp: new Date().toISOString()
    });
  } else {
    // Fixed: Log only critical errors in production
    if (statusCode >= 500) {
      console.error(`Server Error: ${err.message}`, {
        name: err.name,
        statusCode,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Fixed: Send appropriate response based on environment
  const response = {
    success: false,
    message,
    statusCode,
  };
  
  // Fixed: Only include stack trace in development environment
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }
  
  // Fixed: Include additional error details for certain errors
  if (err.name === "ValidationError" && process.env.NODE_ENV === "development") {
    response.details = err.errors;
  }
  
  if (err.code === 11000 && process.env.NODE_ENV === "development") {
    response.duplicateFields = err.keyPattern;
  }
  
  // Fixed: Send CORS headers for error responses (if needed)
  res.setHeader('Content-Type', 'application/json');
  
  res.status(statusCode).json(response);
};

// Fixed: Custom error classes for better error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

class PaymentError extends AppError {
  constructor(message = "Payment processing failed") {
    super(message, 402);
  }
}

class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

// Fixed: Async error wrapper to avoid try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Fixed: 404 handler for routes not found
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
  next(error);
};

export { 
  errorHandler, 
  notFound,
  asyncHandler,
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  PaymentError,
  RateLimitError
};