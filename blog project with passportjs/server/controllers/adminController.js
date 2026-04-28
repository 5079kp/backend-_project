import passport from "passport";
import Admin from "../models/Admin.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: "Username already exists." });
  }

  const user = await Admin.create({ username, password, role: "user" });
  res.status(201).json({ message: "Registration successful", user: { username: user.username, role: user.role } });
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: info?.message || "Invalid credentials" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.status(200).json({ user: { username: user.username, role: user.role } });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });
};

export const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: { username: req.user.username, role: req.user.role, id: req.user._id } });
};
 