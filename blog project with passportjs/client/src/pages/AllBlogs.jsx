import { useEffect, useState } from "react";
import API from "../api/axios";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    API.get("/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="section-header">
          <div>
            <h1>All Blogs</h1>
            <p>Explore every published story with fast view, image previews, and a detailed reading experience.</p>
          </div>
        </div>

        <div className="grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllBlogs;
