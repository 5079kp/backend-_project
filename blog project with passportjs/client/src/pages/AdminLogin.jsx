import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/login.css";

const AdminLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill in both username and password.");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await API.post("/admin/register", form);
        setIsRegister(false);
        setForm({ username: "", password: "" });
        setError("Registration successful. Please log in.");
      } else {
        const res = await API.post("/admin/login", form);
        const role = res.data.user?.role;
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/my-blogs");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="auth-tabs">
          <button
            className={isRegister ? "tab inactive" : "tab active"}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={isRegister ? "tab active" : "tab inactive"}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <h2>{isRegister ? "Create Account" : "Login"}</h2>
        <form onSubmit={handleAuth}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? (isRegister ? "Registering..." : "Logging in...") : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {!isRegister ? (
          <p className="login-note">
            New here? <button className="link-button" onClick={() => setIsRegister(true)} type="button">Create an account</button>
          </p>
        ) : (
          <p className="login-note">
            Already have an account? <button className="link-button" onClick={() => setIsRegister(false)} type="button">Login now</button>
          </p>
        )}

        <p className="login-note">Default admin: <strong>admin / admin123</strong></p>

        <p>
          Go back to <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;