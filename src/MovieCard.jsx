import React, { useState } from "react";

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${imdbID}`);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTrailer = async () => {
    try {
      // Search for trailer on YouTube
      const searchQuery = `${Title} ${Year} official trailer`;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      
      // For now, we'll use a direct YouTube search link
      // In a production app, you'd use YouTube API
      setTrailerUrl(youtubeSearchUrl);
      setShowTrailer(true);
    } catch (error) {
      console.error('Error searching trailer:', error);
    }
  };

  const handleClick = () => {
    setShowDetails(true);
    fetchMovieDetails();
  };

  const closeModal = () => {
    setShowDetails(false);
    setMovieDetails(null);
    setShowTrailer(false);
    setTrailerUrl("");
  };

  const openTrailer = () => {
    searchTrailer();
  };

  return (
    <>
      <div className="movie" key={imdbID} onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div>
          <p>{Year}</p>
        </div>

        <div>
          <img
            src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/400"}
            alt={Title}
          />
        </div>

        <div>
          <span>{Type}</span>
          <h3>{Title}</h3>
        </div>
      </div>

      {/* Movie Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {loading ? (
              <div className="loading">Loading movie details...</div>
            ) : movieDetails ? (
              <div className="movie-details">
                <div className="movie-details-header">
                  <img
                    src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : "https://via.placeholder.com/300x450"}
                    alt={movieDetails.Title}
                    className="movie-details-poster"
                  />
                  <div className="movie-details-info">
                    <h2>{movieDetails.Title}</h2>
                    <p className="movie-year">{movieDetails.Year}</p>
                    <p className="movie-rating">⭐ {movieDetails.imdbRating}/10</p>
                    <p className="movie-runtime">{movieDetails.Runtime}</p>
                    <p className="movie-genre">{movieDetails.Genre}</p>
                    <p className="movie-director">Director: {movieDetails.Director}</p>
                    <p className="movie-actors">Cast: {movieDetails.Actors}</p>
                    
                    {/* Trailer Button */}
                    <button 
                      className="trailer-btn"
                      onClick={openTrailer}
                    >
                      🎬 Watch Trailer
                    </button>
                  </div>
                </div>
                
                <div className="movie-details-plot">
                  <h3>Plot</h3>
                  <p>{movieDetails.Plot}</p>
                </div>
                
                <div className="movie-details-awards">
                  <h3>Awards</h3>
                  <p>{movieDetails.Awards || 'No awards information available'}</p>
                </div>
              </div>
            ) : (
              <div className="error">Failed to load movie details</div>
            )}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="modal-overlay trailer-overlay" onClick={closeModal}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="trailer-content">
              <h3>🎬 {Title} Trailer</h3>
              <div className="trailer-options">
                <p>Choose how to watch the trailer:</p>
                <div className="trailer-buttons">
                  <a 
                    href={trailerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="trailer-btn youtube-btn"
                  >
                    📺 Watch on YouTube
                  </a>
                  <button 
                    className="trailer-btn search-btn"
                    onClick={() => {
                      const searchQuery = `${Title} ${Year} trailer`;
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                    }}
                  >
                    🔍 Search for Trailer
                  </button>
                </div>
                <div className="trailer-tips">
                  <p><strong>💡 Tips:</strong></p>
                  <ul>
                    <li>Click "Watch on YouTube" to open the official trailer</li>
                    <li>Use "Search for Trailer" to find fan-made content</li>
                    <li>You can also search for "{Title} behind the scenes"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
