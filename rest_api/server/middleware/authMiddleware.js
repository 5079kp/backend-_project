import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  
  try {
    
    token = req.cookies.jwt;
    
    // Fixed: Also check Authorization header as fallback
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
    
    // Fixed: Verify token with proper error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Fixed: Differentiate between token expiration and invalid token
      if (jwtError.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error("Token expired, please login again");
      } else if (jwtError.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error("Invalid token");
      } else {
        res.status(401);
        throw new Error("Token verification failed");
      }
    }
    
    // Fixed: Check if userId exists in decoded token
    if (!decoded || !decoded.userId) {
      res.status(401);
      throw new Error("Invalid token payload");
    }
    
    // Fixed: Check if user still exists in database
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    
    // Fixed: Check if user account is active (soft delete check)
    if (user.isDeleted) {
      res.status(401);
      throw new Error("Account has been deactivated");
    }
    
    req.user = user;
    next();
    
  } catch (error) {
    // Fixed: Proper error response instead of just throwing
    res.status(res.statusCode === 200 ? 401 : res.statusCode).json({
      success: false,
      message: error.message,
      // Fixed: Don't expose stack trace in production
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};
const admin = (req, res, next) => {
  try {
    // Fixed: Check if user exists in request
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    
    // Fixed: Check if user role is admin
    if (req.user.role !== "admin") {
      res.status(403); // Fixed: Use 403 Forbidden instead of 401
      throw new Error("Not authorized as an admin");
    }
    
    next();
  } catch (error) {
    res.status(res.statusCode === 200 ? 403 : res.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};
const isVerified = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    
    if (!req.user.isVerified) {
      res.status(403);
      throw new Error("Please verify your email to access this resource");
    }
    
    next();
  } catch (error) {
    res.status(res.statusCode === 200 ? 403 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const checkOwnership = (resourceUserId) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized");
      }
      
      // Admin can access any resource
      if (req.user.role === "admin") {
        return next();
      }
      
      // Check if user owns the resource
      if (req.user._id.toString() !== resourceUserId.toString()) {
        res.status(403);
        throw new Error("Not authorized to access this resource");
      }
      
      next();
    } catch (error) {
      res.status(res.statusCode === 200 ? 403 : res.statusCode).json({
        success: false,
        message: error.message
      });
    }
  };
};

export { 
  protect, 
  admin, 
  isVerified,     
  checkOwnership  
};