import Blog from "../models/Blog.js";

const formatBlog = (blog, sessionId) => {
  const liked = blog.likedBy.includes(sessionId);
  const disliked = blog.dislikedBy.includes(sessionId);
  return {
    ...blog.toObject(),
    liked,
    disliked,
    likes: blog.likes,
    dislikes: blog.dislikes,
  };
};

const canModify = (blog, user) => {
  if (!user) return false;
  return user.role === "admin" || blog.author?.toString() === user._id.toString();
};

export const createBlog = async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    description: req.body.description,
    image: req.file?.filename || "",
    author: req.user._id,
    authorName: req.user.username,
  });
  res.json(blog);
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

export const getMyBlogs = async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
  res.json(blogs);
};

export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.json(formatBlog(blog, req.sessionID));
};

export const likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const sessionId = req.sessionID;
  const alreadyLiked = blog.likedBy.includes(sessionId);
  const alreadyDisliked = blog.dislikedBy.includes(sessionId);

  if (alreadyLiked) {
    blog.likedBy.pull(sessionId);
    blog.likes = Math.max(blog.likes - 1, 0);
  } else {
    if (alreadyDisliked) {
      blog.dislikedBy.pull(sessionId);
      blog.dislikes = Math.max(blog.dislikes - 1, 0);
    }
    blog.likedBy.push(sessionId);
    blog.likes += 1;
  }

  await blog.save();
  res.json(formatBlog(blog, sessionId));
};

export const dislikeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const sessionId = req.sessionID;
  const alreadyLiked = blog.likedBy.includes(sessionId);
  const alreadyDisliked = blog.dislikedBy.includes(sessionId);

  if (alreadyDisliked) {
    blog.dislikedBy.pull(sessionId);
    blog.dislikes = Math.max(blog.dislikes - 1, 0);
  } else {
    if (alreadyLiked) {
      blog.likedBy.pull(sessionId);
      blog.likes = Math.max(blog.likes - 1, 0);
    }
    blog.dislikedBy.push(sessionId);
    blog.dislikes += 1;
  }

  await blog.save();
  res.json(formatBlog(blog, sessionId));
};

export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  if (!canModify(blog, req.user)) {
    return res.status(403).json({ message: "You do not have permission to delete this blog." });
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
};

export const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  if (!canModify(blog, req.user)) {
    return res.status(403).json({ message: "You do not have permission to update this blog." });
  }

  const updateData = {
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) {
    updateData.image = req.file.filename;
  }
  const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
};
