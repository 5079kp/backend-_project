import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading movie:", err);
        setError("Unable to load movie details.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      await API.put(`/movies/${id}`, formData);
      navigate(`/admin`);
    } catch (err) {
      console.error("Update movie failed:", err);
      setError("Failed to update movie. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-form" style={{ textAlign: "center" }}>
        <p>Loading movie data...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="admin-form" style={{ textAlign: "center" }}>
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>✏️ Edit Movie</h2>

      <div className="form-group">
        <label htmlFor="title">Movie Title *</label>
        <input
          id="title"
          name="title"
          defaultValue={movie.title}
          placeholder="Enter movie title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          defaultValue={movie.description}
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
          defaultValue={movie.rating}
          placeholder="8.5"
          min="0"
          max="10"
          step="0.1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="trailerLink">Trailer YouTube URL</label>
        <input
          id="trailerLink"
          name="trailerLink"
          type="url"
          defaultValue={movie.trailerLink}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Replace Poster/Image</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Updating Movie..." : "Save Changes"}
      </button>

      {error && (
        <div className="form-error">{error}</div>
      )}
    </form>
  );
}
