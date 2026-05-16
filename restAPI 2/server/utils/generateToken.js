import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Add validation
  if (!res) {
    throw new Error("Response object is required");
  }
  
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    path: "/",
  });
};

export default generateToken;