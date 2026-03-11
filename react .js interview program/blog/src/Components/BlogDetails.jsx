import React,{useEffect,useState} from "react";
import axios from "axios";
import {useParams, Link} from "react-router-dom";

function BlogDetails(){

const {id} = useParams();

const [blog,setBlog]=useState({});
const [loading, setLoading] = useState(true);

useEffect(()=>{
const fetchblogs = async()=>{
try{
  const res = await axios.get(`http://localhost:3000/blogs/${id}`);
  setBlog(res.data);
} catch(error){
  console.log(error);
} finally {
  setLoading(false);
}
};
fetchblogs();
},[id]);

if(loading){
return <div className="loading">Loading...</div>;
}

return(

<div className="blog-details">
  <Link to="/" className="back-link">← Back to Blogs</Link>
  <h2>{blog.title}</h2>
  <span className="blog-category">{blog.category}</span>
  <img src={blog.image} alt={blog.title}/>
  <p>{blog.description}</p>
  <p><b>Author:</b> {blog.blogger_name}</p>
</div>

);

}

export default BlogDetails;

