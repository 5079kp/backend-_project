import Blog  from "../models/Blog.js";

export const createBlog = async (req, res) => {
    const blog = await Blog.create({
        title: req.body.title,
        description: req.body.description,
        image:req.file.filename
    }); 
    res.json(blog);
};

export  const getBlogs = async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
};

export const getBlogById = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
};

export const deleteBlog  = async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({message:"Blog deleted"});
};

export const updateBlog = async (req, res) => {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({message:"Blog updated"});
};
