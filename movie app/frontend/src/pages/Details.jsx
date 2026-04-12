import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Details() {
  const { id } = useParams();
  const nav = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/movies/${id}`)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching movie:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="details">
        <p style={{textAlign: "center", fontSize: "1.3rem"}}>Loading movie details...</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete movie '${movie.title}'?`)) {
      return;
    }

    try {
      await API.delete(`/movies/${movie._id}`);
      nav("/");
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Unable to delete movie. Please try again.");
    }
  };

  if (!movie) {
    return (
      <div className="details">
        <p style={{textAlign: "center", fontSize: "1.3rem", color: "#ff6b6b"}}>Movie not found</p>
        <button 
          onClick={() => nav("/")}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "20px"
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="details">
      {movie.trailerLink && (
        <div className="trailer-embed">
          <iframe 
            width="100%" 
            height="400" 
            src={movie.trailerLink.replace('watch?v=', 'embed/')} 
            title="Movie Trailer"
            frameBorder="0"
            allowFullScreen 
          />
        </div>
      )}

      <div className="details-top">
        <div>
          <h1>{movie.title}</h1>
          {movie.rating && (
            <div className="details-rating">
              ⭐ Rating: {movie.rating}/10
            </div>
          )}
        </div>

        <div className="details-actions">
          <button onClick={() => nav(`/admin/edit/${movie._id}`)} className="edit-btn">
            ✏️ Edit Movie
          </button>
          <button onClick={handleDelete} className="delete-btn">
            🗑️ Delete Movie
          </button>
        </div>
      </div>

      <div className="details-section">
        <h3>📝 Description</h3>
        <p>{movie.description}</p>
      </div>

      {movie.reviews && movie.reviews.length > 0 && (
        <div className="details-section">
          <h3>💬 Reviews</h3>
          <div className="review-list">
            {movie.reviews.map((r, i) => (
              <div key={i} className="review-item">
                {r.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="back-home" onClick={() => nav("/")}>← Back to Home</button>
    </div>
  );
}