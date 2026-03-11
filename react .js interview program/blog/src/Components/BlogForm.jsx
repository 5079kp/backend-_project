import React, { useState } from "react";
import axios from "axios";

function BlogForm({ onBlogAdded }) {

const [form, setForm] = useState({
category:"",
title:"",
blogger_name:"",
image:"",
description:""
});

const [error,setError] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const validate = () => {

let err = {};

if(!form.category){
err.category="Category required";
}

if(form.title.length < 5){
err.title="Title must be at least 5 characters";
}

if(form.blogger_name.length < 5){
err.blogger_name="Name must be at least 5 characters";
}

if(!form.image){
err.image="Image URL required";
}

if(!form.description || form.description.length < 3){
err.description="Description must be at least 3 characters";
}

setError(err);

return Object.keys(err).length === 0;

};

const handleSubmit = async(e)=>{

e.preventDefault();

if(!validate()) return;

setIsSubmitting(true);

try{
  await axios.post("http://localhost:3000/blogs",form);
  
  // Reset form
  setForm({
    category:"",
    title:"",
    blogger_name:"",
    image:"",
    description:""
  });
  
  // Refresh blog list
  if (onBlogAdded) {
    await onBlogAdded();
  }
  
  alert("Blog Added Successfully!");
} catch(error){
  console.error("Error adding blog:", error);
  alert("Error adding blog. Make sure JSON server is running!");
} finally {
  setIsSubmitting(false);
}

};

return(

<form className="blog-form" onSubmit={handleSubmit}>
  <h2>Create New Blog</h2>

  <select name="category" value={form.category} onChange={handleChange}>
    <option value="">Select Category</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Technology">Technology</option>
    <option value="Sports">Sports</option>
    <option value="Business">Business</option>
    <option value="Health">Health</option>
    <option value="Science">Science</option>
  </select>
  {error.category && <p className="error">{error.category}</p>}

  <input
    type="text"
    name="title"
    placeholder="Title (min 5 characters)"
    value={form.title}
    onChange={handleChange}
  />
  {error.title && <p className="error">{error.title}</p>}

  <input
    type="text"
    name="blogger_name"
    placeholder="Blogger Name (min 5 characters)"
    value={form.blogger_name}
    onChange={handleChange}
  />
  {error.blogger_name && <p className="error">{error.blogger_name}</p>}

  <input
    type="text"
    name="image"
    placeholder="Image URL (e.g., https://example.com/image.jpg)"
    value={form.image}
    onChange={handleChange}
  />
  {error.image && <p className="error">{error.image}</p>}

  <textarea
    name="description"
    placeholder="Description (min 3 characters)"
    value={form.description}
    onChange={handleChange}
  />
  {error.description && <p className="error">{error.description}</p>}

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Adding..." : "Add Blog"}
  </button>
</form>

);

}

export default BlogForm;

