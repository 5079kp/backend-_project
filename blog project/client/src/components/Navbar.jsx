import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    return (
        <div className="navbar">
            <h2>BLOGGING</h2>
            <div>
               <Link to="/">Home</Link>
               <Link to="/admin">Admin</Link>
               <Link to="/dashboard">Dashboard</Link>
            </div>
        </div>
    );
};

export default Navbar