import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog._id}`}>
      <motion.div 
        className="card"
        whileHover={{ scale: 1.05 }}
      >
        {blog.image && (
          <img src={`http://localhost:5001/uploads/${blog.image}`} alt={blog.title} />
        )}
        <h3>{blog.title}</h3>
        <p>{blog.description.substring(0, 80)}...</p>
      </motion.div>
    </Link>
  );
};

export default BlogCard;