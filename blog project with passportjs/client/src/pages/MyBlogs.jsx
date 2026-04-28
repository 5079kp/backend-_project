import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

const MyBlogs = () => {
  const [user, setUser] = useState(undefined);
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [editBlog, setEditBlog] = useState(null);
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    try {
      const res = await API.get("/admin/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  const loadBlogs = async () => {
    try {
      const res = await API.get("/blogs/mine");
      setBlogs(res.data);
    } catch (err) {
      setBlogs([]);
    }
  };

  useEffect(() => {
    loadProfile();
    loadBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.image) {
      setMessage("Please complete all fields and choose an image.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("image", form.image);
      await API.post("/blogs/add", data);
      setMessage("Blog created successfully.");
      setForm({ title: "", description: "", image: null });
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create blog.");
    }
  };

  const startEdit = (blog) => {
    setEditBlog(blog);
    setForm({ title: blog.title, description: blog.description, image: null });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditBlog(null);
    setForm({ title: "", description: "", image: null });
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!editBlog) return;

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      if (form.image) data.append("image", form.image);
      await API.put(`/blogs/${editBlog._id}`, data);
      setMessage("Blog updated successfully.");
      cancelEdit();
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update blog.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/blogs/${id}`);
      setMessage("Blog deleted successfully.");
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete blog.");
    }
  };

  if (user === undefined) {
    return (
      <div className="dashboard">
        <div className="form">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard">
        <div className="form">
          <h2>Login required</h2>
          <p>
            Please <Link to="/auth">login or register</Link> before managing your blogs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard admin-dashboard">
        <div className="dashboard-panel">
          <div className="form">
            <h2>{editBlog ? "Edit Your Blog" : "Add a New Blog"}</h2>
            <p className="login-note">Logged in as {user.username}</p>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
            <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            <button onClick={editBlog ? handleUpdate : handleSubmit}>
              {editBlog ? "Update Blog" : "Create Blog"}
            </button>
            {editBlog && (
              <button className="secondary-button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
            {message && <p className="dashboard-message">{message}</p>}
          </div>

          <div className="blog-list">
            <h2>My Blogs</h2>
            {blogs.length === 0 && <p>No blog posts yet. Add one to get started.</p>}
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.description.substring(0, 120)}...</p>
                <div className="action-buttons">
                  <button onClick={() => startEdit(blog)}>Edit</button>
                  <button onClick={() => handleDelete(blog._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
