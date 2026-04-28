import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import "../styles/blogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    API.get(`/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        setBlog(null);
        setError(err?.response?.data?.message || "Failed to load blog details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="blog-details loading">
        <div className="loader">Loading blog details...</div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="blog-details loading">
        <div className="loader">
          {error || "Blog not found or failed to load."}
        </div>
      </section>
    );
  }

  const imageUrl = blog.image
    ? blog.image.startsWith("http")
      ? blog.image
      : `http://localhost:5001/uploads/${blog.image}`
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="blog-details"
    >
      <div className="blog-details-card">
        <div className="blog-details__hero">
          <div className="blog-details__meta">
            <span className="tag">Blog Detail</span>
          </div>
          <h1 className="blog-details__title">{blog.title}</h1>
          {imageUrl && (
            <img className="blog-details__image" src={imageUrl} alt={blog.title} />
          )}
          <div className="blog-details__content">
            <p>{blog.description}</p>
          </div>
          <div className="blog-details__footer">
            <button className="blog-details__button" onClick={() => navigate(-1)}>
              Back to blogs
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BlogDetails;