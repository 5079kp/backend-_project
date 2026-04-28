import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { backendOrigin } from "../api/axios";

const BlogCard = ({ blog }) => {
  const imageUrl = blog.image
    ? blog.image.startsWith("http")
      ? blog.image
      : `${backendOrigin}/uploads/${blog.image}`
    : null;

  return (
    <Link to={`/blog/${blog._id}`} className="card-link">
      <motion.div
        className="card"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        {imageUrl && <img src={imageUrl} alt={blog.title} />}

        <div className="card-body">
          <h3>{blog.title}</h3>
          <p>{blog.description?.substring(0, 120)}...</p>
        </div>

        <div className="card-footer">
          <div className="card-stats">
            <span>👍 {blog.likes || 0}</span>
            <span>👎 {blog.dislikes || 0}</span>
          </div>
          <div className="card-action">View details</div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;
