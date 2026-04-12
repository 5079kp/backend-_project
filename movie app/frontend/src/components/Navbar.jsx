import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

export default function Navbar() {
  const logoRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    gsap.from(linksRef.current, {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="navbar">
      <div className="logo" ref={logoRef} style={{width: '60px', height: '60px', cursor: 'pointer'}}>
        <svg viewBox="0 0 60 60" style={{width: '100%', height: '100%'}}>
          <rect width="60" height="60" fill="#ff0000" rx="8"/>
          <text x="30" y="38" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">MA</text>
        </svg>
      </div>
      <h2>MovieApp</h2>
      <ul>
        <li><Link to="/" className="nav-link" ref={el => (linksRef.current[0] = el)}>Home</Link></li>
        <li><Link to="/admin" className="nav-link" ref={el => (linksRef.current[1] = el)}>Admin</Link></li>
      </ul>
    </div>
  );
};
