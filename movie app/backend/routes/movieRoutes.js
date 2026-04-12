import express from "express";
import { upload } from "../middleware/upload.js";
import {
  addMovie,
  getMovies,
  getMovie,
  deleteMovie,
  updateMovie
} from "../controllers/movieController.js";

const router = express.Router();

// ADD MOVIE (POST)
router.post(
  "/",
  upload.single("image"),
  addMovie
);

// GET ALL MOVIES
router.get("/", getMovies);

// GET SINGLE MOVIE
router.get("/:id", getMovie);

// UPDATE MOVIE
router.put("/:id", upload.single("image"), updateMovie);

// DELETE MOVIE
router.delete("/:id", deleteMovie);

export default router;