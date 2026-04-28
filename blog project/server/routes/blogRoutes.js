import express from "express";
import {createBlog, getBlogs, getBlogById, deleteBlog, updateBlog} from "../controllers/blogController.js";
import{upload} from "../middleware/multer.js";
import {isAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/add" , isAuth, upload.single("image"), createBlog);
router.delete("/:id", isAuth, deleteBlog);
router.put("/:id", isAuth, updateBlog);

export default router;
