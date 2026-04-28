import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AllBlogs from "./pages/AllBlogs";
import BlogDetails from "./pages/BlogDetails";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import MyBlogs from "./pages/MyBlogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/auth" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;