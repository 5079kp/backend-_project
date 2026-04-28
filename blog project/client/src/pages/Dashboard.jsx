import { useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [form, setForm] = useState({
    title:"",
    description:"",
    image:null
  });

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("image", form.image);

      await API.post("/blogs/add", data);
      alert("Blog Added");
      setForm({ title: "", description: "", image: null });
    } catch (error) {
      alert(error.response?.data?.message || "Could not publish blog");
    }
  };

  return (
    <div className="dashboard">
      
      <motion.div 
        className="form"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
      >
        <h2>Add Blog</h2>

        <input placeholder="Title" onChange={e => setForm({...form, title:e.target.value})}/>
        <textarea placeholder="Description" onChange={e => setForm({...form, description:e.target.value})}></textarea>
        <input type="file" onChange={e => setForm({...form, image:e.target.files[0]})}/>

        <button onClick={handleSubmit}>Publish</button>
      </motion.div>

    </div>
  );
};

export default Dashboard;