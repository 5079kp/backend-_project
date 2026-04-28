import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.get("/admin/logout");
    } catch (err) {
      console.warn(err);
    }
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <h2>BLOGGING</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/blogs">Blog Page</Link>
        <Link to="/my-blogs">My Blogs</Link>
        <Link to="/dashboard">Admin Dashboard</Link>
        <Link to="/auth">Login / Register</Link>
        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
