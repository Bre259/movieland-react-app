import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const API_KEY = "33ac2980";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const MovieDetail = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}&i=${imdbID}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [imdbID]);

  if (loading)
    return (
      <div className="movie-detail-loading">
        <LoadingSpinner size="large" text="Loading movie details..." />
      </div>
    );
  if (!movie || movie.Response === "False")
    return (
      <div style={{ padding: 40 }}>
        <h2>Movie not found.</h2>
      </div>
    );

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <Link to="/">← Back to search</Link>
      <h1>
        {movie.Title} ({movie.Year})
      </h1>
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
          movie.Title + " trailer"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          margin: "10px 0",
          padding: "8px 16px",
          background: "#c4302b",
          color: "white",
          borderRadius: 4,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ▶ Watch Trailer on YouTube
      </a>
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/400"
        }
        alt={movie.Title}
        style={{ width: 200, float: "left", marginRight: 20 }}
      />
      <div>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Director:</strong> {movie.Director}
        </p>
        <p>
          <strong>Actors:</strong> {movie.Actors}
        </p>
        <p>
          <strong>Plot:</strong> {movie.Plot}
        </p>
        <p>
          <strong>IMDB Rating:</strong> {movie.imdbRating}
        </p>
        <p>
          <strong>Runtime:</strong> {movie.Runtime}
        </p>
        <p>
          <strong>Released:</strong> {movie.Released}
        </p>
        <p>
          <strong>Language:</strong> {movie.Language}
        </p>
        <p>
          <strong>Country:</strong> {movie.Country}
        </p>
      </div>
    </div>
  );
};

export default MovieDetail;
