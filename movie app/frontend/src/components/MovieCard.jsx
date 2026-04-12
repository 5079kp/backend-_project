import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, onDelete }) {
  const nav = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Delete movie '${movie.title}'?`)) {
      onDelete?.(movie._id);
    }
  };

  return (
    <div className="card">
      <img src={`http://localhost:5000/${movie.image}`} alt={movie.title} />
      
      <div className="card-content">
        <h3>{movie.title}</h3>
        
        {movie.description && (
          <p>{movie.description.substring(0, 80)}...</p>
        )}

        {movie.rating && (
          <div className="card-rating">
            <span>⭐ Rating: </span>
            <span className="rating-value">{movie.rating}/10</span>
          </div>
        )}

        <div className="card-buttons">
          <button onClick={() => nav(`/details/${movie._id}`)}>
            📖 View More
          </button>

          <button className="edit-btn" onClick={() => nav(`/admin/edit/${movie._id}`)}>
            ✏️ Edit
          </button>

          <button className="delete-btn" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
