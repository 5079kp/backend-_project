import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API, { backendOrigin } from "../api/axios";
import "../styles/blogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadBlog = async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      setBlog(null);
      setError(err?.response?.data?.message || "Failed to load blog details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
  }, [id]);

  const handleVote = async (type) => {
    setFeedback("");
    try {
      const res = await API.put(`/blogs/${id}/${type}`);
      setBlog(res.data);
      setFeedback(`You ${type === "like" ? "liked" : "disliked"} this post.`);
    } catch (err) {
      setFeedback(err?.response?.data?.message || "Unable to register your vote.");
    }
  };

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
      : `${backendOrigin}/uploads/${blog.image}`
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
            <div className="blog-details__votes">
              <button
                className={`vote-button ${blog.liked ? "active" : ""}`}
                onClick={() => handleVote("like")}
              >
                👍 {blog.likes || 0}
              </button>
              <button
                className={`vote-button ${blog.disliked ? "active dislike" : ""}`}
                onClick={() => handleVote("dislike")}
              >
                👎 {blog.dislikes || 0}
              </button>
            </div>
          </div>
          <h1 className="blog-details__title">{blog.title}</h1>
          {imageUrl && (
            <img className="blog-details__image" src={imageUrl} alt={blog.title} />
          )}
          <div className="blog-details__content">
            <p>{blog.description}</p>
          </div>
          {feedback && <p className="blog-details__feedback">{feedback}</p>}
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