import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import API from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies").then(res => setMovies(res.data));
  }, []);

  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.hero-letter'), {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, []);

  const handleDeleteMovie = async (movieId) => {
    try {
      await API.delete(`/movies/${movieId}`);
      setMovies(prev => prev.filter(movie => movie._id !== movieId));
    } catch (error) {
      console.error("Delete movie failed:", error);
      alert("Could not delete movie. Please try again.");
    }
  };

  return (
    <>
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg"></div>
        <h1 className="hero-title">
          Welcome to <span className="hero-letter">M</span><span className="hero-letter">o</span><span className="hero-letter">v</span><span className="hero-letter">i</span><span className="hero-letter">e</span>{' '}
          <span className="hero-letter">W</span><span className="hero-letter">o</span><span className="hero-letter">r</span><span className="hero-letter">l</span><span className="hero-letter">d</span> 🎬
        </h1>
      </section>
      <div className="grid">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} onDelete={handleDeleteMovie} />
        ))}
      </div>
    </>
  );
}
