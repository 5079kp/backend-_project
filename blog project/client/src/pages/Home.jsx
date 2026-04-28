import { useEffect, useState } from "react";
import API from "../api/axios";
import gsap from "gsap";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    API.get("/blogs").then(res => setBlogs(res.data));

    gsap.from(".card", {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 1
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Latest Blogs</h1>
        <div className="grid">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;



