import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  likeBlog,
  dislikeBlog,
  getMyBlogs,
} from "../controllers/blogController.js";
import { upload } from "../middleware/multer.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/mine", isAuth, getMyBlogs);
router.get("/:id", getBlogById);
router.post("/add", isAuth, upload.single("image"), createBlog);
router.put("/:id/like", likeBlog);
router.put("/:id/dislike", dislikeBlog);
router.put("/:id", isAuth, upload.single("image"), updateBlog);
router.delete("/:id", isAuth, deleteBlog);

export default router;
