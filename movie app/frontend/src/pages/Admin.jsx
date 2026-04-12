import { useEffect, useState } from "react";
import API from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      const response = await API.get("/movies");
      setMovies(response.data);
    } catch (err) {
      console.error("Failed to load movies:", err);
      setError("Unable to load movies.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const response = await API.post("/movies", formData);
      setMovies((prev) => [response.data, ...prev]);
      setSuccess(true);
      e.target.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding movie:", err);
      setError("Unable to add movie. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      await API.delete(`/movies/${movieId}`);
      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete movie. Please try again.");
    }
  };

  return (
    <div className="admin-page">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>🎬 Add New Movie</h2>

        <div className="form-group">
          <label htmlFor="title">Movie Title *</label>
          <input
            id="title"
            name="title"
            placeholder="Enter movie title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Write a compelling description..."
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating (0-10) *</label>
          <input
            id="rating"
            name="rating"
            type="number"
            placeholder="8.5"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Movie Poster/Image *</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="trailerLink">Trailer YouTube URL</label>
          <input
            id="trailerLink"
            name="trailerLink"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding Movie..." : "✨ Add Movie"}
        </button>

        {success && <div className="form-success">✅ Movie Added Successfully!</div>}
        {error && <div className="form-error">{error}</div>}
      </form>

      <section className="admin-movie-list">
        <h2>Existing Movies</h2>
        <div className="grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onDelete={handleDeleteMovie} />
          ))}
        </div>
      </section>
    </div>
  );
}
