import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });
};

export default initPassport;
