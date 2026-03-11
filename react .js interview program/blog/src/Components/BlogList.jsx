import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";

function BlogList({ blogs = [], refreshBlogs }){

const [filter,setFilter]=useState("All");

useEffect(()=>{
if (refreshBlogs) {
  refreshBlogs();
}
},[refreshBlogs]);

const filteredBlogs = filter === "All" 
  ? blogs 
  : blogs.filter(blog => blog.category === filter);

if (!blogs || blogs.length === 0) {
  return (
    <div className="blog-list">
      <h2>All Blogs</h2>
      <p style={{color: 'white', textAlign: 'center'}}>No blogs found. Add one above!</p>
    </div>
  );
}

return(

<div className="blog-list">
  <h2>All Blogs</h2>

  <select className="filter-select" onChange={(e)=>setFilter(e.target.value)} value={filter}>
    <option value="All">All Categories</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Technology">Technology</option>
    <option value="Sports">Sports</option>
    <option value="Business">Business</option>
    <option value="Health">Health</option>
    <option value="Science">Science</option>
  </select>

  <div className="blog-grid">
    {filteredBlogs.map(blog=>(
      <div className="blog-card" key={blog.id}>
        <img src={blog.image} alt={blog.title || 'Blog'}/>
        <span className="blog-category">{blog.category || 'General'}</span>
        <h3>{blog.title}</h3>
        <p>{blog.description ? blog.description.slice(0, 80) + '...' : 'No description'}</p>
        <Link to={`/blog/${blog.id}`} className="read-more">Read More →</Link>
      </div>
    ))}
  </div>
</div>

);

}

export default BlogList;

