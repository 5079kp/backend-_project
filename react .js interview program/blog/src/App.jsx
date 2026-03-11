import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BlogForm from "./Components/BlogForm";
import BlogList from "./Components/BlogList";
import BlogDetails from "./Components/BlogDetails";

function App() {

const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchBlogs = async () => {
  try{
    const res = await axios.get("http://localhost:3000/blogs");
    setBlogs(res.data);
    setError(null);
  }
  catch(err){
    console.log("Error fetching blogs:", err);
    setError("Failed to connect to server. Make sure JSON server is running on port 3000");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBlogs();
}, []);

return(

<BrowserRouter>

<div className="app-container">
  <h1>Blog App</h1>

  {error && (
    <div style={{background: '#ff6b6b', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
      {error}
      <br/>
      <small>Run: npx json-server --watch db.json --port 3000</small>
    </div>
  )}

  <Routes>

  <Route path="/" element={
  <>
  <BlogForm onBlogAdded={fetchBlogs}/>
  {loading ? (
    <p style={{color: 'white', textAlign: 'center'}}>Loading blogs...</p>
  ) : (
    <BlogList blogs={blogs} refreshBlogs={fetchBlogs}/>
  )}
  </>
  }/>

  <Route path="/blog/:id" element={<BlogDetails/>}/>

  </Routes>
</div>

</BrowserRouter>

);

}

export default App;

