import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import gsap from "gsap";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import TravelTags from "../components/TravelTags";
import "../styles/home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    API.get("/blogs")
      .then((res) => setBlogs(res.data || []))
      .catch((err) => console.error("Home fetch error:", err));

    gsap.from(".card", {
      opacity: 0,
      y: 40,
      stagger: 0.18,
      duration: 0.8,
      delay: 0.45,
      ease: "power3.out",
    });
  }, []);

  const stats = [
    { label: "Destinations", value: 50, suffix: "+" },
    { label: "Travel Stories", value: 200, suffix: "+" },
    { label: "Travelers", value: 10, suffix: "K+" },
    { label: "Satisfaction", value: 99, suffix: "%" },
  ];

  const categories = [
    { name: "Mountain Trekking", icon: "⛰️", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { name: "Beach Paradise", icon: "🏖️", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { name: "City Exploration", icon: "🏙️", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { name: "Cultural Journey", icon: "🎭", bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { name: "Food & Cuisine", icon: "🍲", bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { name: "Road Trips", icon: "🚗", bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  ];

  return (
    <>
      <Navbar />
      <main className="home-page">
        <section className="hero-section">
          <div className="hero-bg-animation">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
          </div>

          <div className="container hero-content">
            <div className="hero-copy">
              <span className="hero-badge">✈️ Travel Blogs</span>
              <h1 className="hero-title">Discover the world with inspiring travel stories.</h1>
              <p className="hero-description">
                Browse unique journeys, real experiences, and insider tips from adventurers around the globe.
                Read, explore, and share your next destination story.
              </p>

              <TravelTags />

              <div className="hero-actions">
                <Link to="/blogs" className="btn-primary">
                  Explore Blogs
                </Link>
                <Link to="/auth" className="btn-secondary">
                  Start Writing
                </Link>
              </div>

              <div className="hero-search-card">
                <div className="search-input-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.3-4.3"></path>
                  </svg>
                  <input type="text" placeholder="Search destinations, tags or stories" readOnly />
                  <Link to="/blogs" className="search-btn">Search</Link>
                </div>
              </div>
            </div>

            <div className="hero-panel">
              <div className="hero-panel-card">
                <h2>Top travel stats</h2>
                <p>Our community is growing fast—discover the destinations and stories readers love most.</p>
                <div className="hero-summary">
                  {stats.map((item) => (
                    <div key={item.label}>
                      <strong>{item.value}{item.suffix}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Latest adventures</h2>
                <p>Read the newest travel stories handpicked for explorers and creators.</p>
              </div>
              <Link to="/blogs" className="view-all-link">View all</Link>
            </div>

            <div className="grid">
              {blogs.length ? (
                blogs.slice(0, 6).map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.45 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">No travel stories are available yet.</div>
              )}
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Explore by category</h2>
                <p>Choose the type of adventure that fits your next journey.</p>
              </div>
            </div>

            <div className="categories-grid">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  className="category-card"
                  style={{ background: cat.bg }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
