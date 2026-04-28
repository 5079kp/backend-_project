import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/dashboard.css";

const Dashboard = () => {
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
      const res = await API.get("/blogs");
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
      setMessage("Please add a title, description, and image.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("image", form.image);

      await API.post("/blogs/add", data);
      setMessage("Blog published successfully.");
      setForm({ title: "", description: "", image: null });
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not publish blog.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/blogs/${id}`);
      setMessage("Blog deleted successfully.");
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete blog.");
    }
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setForm({ title: blog.title, description: blog.description, image: null });
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
      setEditBlog(null);
      setForm({ title: "", description: "", image: null });
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update blog.");
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

  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard">
        <div className="form">
          <h2>Admin access only</h2>
          <p>Only the admin user can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-panel">
        <div className="form">
          <h2>{editBlog ? "Edit Blog" : "Add Blog"}</h2>

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
          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <button onClick={editBlog ? handleUpdate : handleSubmit}>
            {editBlog ? "Save Changes" : "Publish"}
          </button>
          {editBlog && (
            <button
              className="secondary-button"
              onClick={() => {
                setEditBlog(null);
                setForm({ title: "", description: "", image: null });
              }}
            >
              Cancel Edit
            </button>
          )}
          {message && <p className="dashboard-message">{message}</p>}
        </div>

        <div className="blog-list">
          <h2>All Blogs</h2>
          {blogs.length === 0 && <p>No blogs published yet.</p>}
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <h3>{blog.title}</h3>
              <p>{blog.description.substring(0, 120)}...</p>
              <div className="action-buttons">
                <button onClick={() => handleEdit(blog)}>Edit</button>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;