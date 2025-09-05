import React, { useState } from "react";

// API Configuration - matching App.js
const NETLIFY_API_URL =
  "https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api";
const OMDB_DIRECT_URL = "https://www.omdbapi.com";
const OMDB_API_KEY = "33ac2980";

const TVSeriesCard = ({ series: { imdbID, Year, Poster, Title, Type } }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [seriesDetails, setSeriesDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [error, setError] = useState("");

  // Fallback function for direct OMDB API calls
  const fetchSeriesDetailsDirectly = async (seriesId) => {
    try {
      const response = await fetch(
        `${OMDB_DIRECT_URL}?apikey=${OMDB_API_KEY}&i=${seriesId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.Response === "False") {
        throw new Error(data.Error || "Series not found");
      }

      return data;
    } catch (error) {
      throw new Error(`Direct API call failed: ${error.message}`);
    }
  };

  const fetchSeriesDetails = async () => {
    setLoading(true);
    setError("");

    try {
      // First try Netlify Functions
      const response = await fetch(`${NETLIFY_API_URL}/movies/${imdbID}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSeriesDetails(data);
      console.log("Series details loaded via Netlify Functions:", data);
    } catch (error) {
      console.warn(
        "Netlify Functions failed for series details, trying direct OMDB API:",
        error.message
      );

      try {
        // Fallback to direct OMDB API
        const data = await fetchSeriesDetailsDirectly(imdbID);
        setSeriesDetails(data);
        console.log("Series details loaded via direct OMDB API:", data);
        console.info(
          "✅ Using direct OMDB API as fallback - series details loaded successfully"
        );
      } catch (fallbackError) {
        console.error("Both APIs failed for series details:", fallbackError);
        setError(`Failed to load series details: ${fallbackError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchTrailer = async () => {
    try {
      // Search for trailer on YouTube
      const searchQuery = `${Title} ${Year} official trailer`;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery
      )}`;

      setTrailerUrl(youtubeSearchUrl);
      setShowTrailer(true);
    } catch (error) {
      console.error("Error searching trailer:", error);
    }
  };

  const handleClick = () => {
    setShowDetails(true);
    fetchSeriesDetails();
  };

  const closeModal = () => {
    setShowDetails(false);
    setSeriesDetails(null);
    setShowTrailer(false);
    setTrailerUrl("");
    setError("");
  };

  const openTrailer = () => {
    searchTrailer();
  };

  return (
    <>
      <div
        className="tv-series-card"
        key={imdbID}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="series-badge">
          <span>📺 TV</span>
        </div>

        <div className="series-poster">
          <img
            src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/400"}
            alt={Title}
          />
        </div>

        <div className="series-info">
          <span className="series-type">{Type}</span>
          <h3 className="series-title">{Title}</h3>
          <p className="series-year">{Year}</p>
        </div>
      </div>

      {/* Series Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content series-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            {loading ? (
              <div className="loading">
                <p>Loading series details...</p>
                <div className="loading-spinner">⏳</div>
              </div>
            ) : error ? (
              <div className="error">
                <h3>❌ Failed to load series details</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button
                    className="retry-btn"
                    onClick={() => {
                      setError("");
                      fetchSeriesDetails();
                    }}
                  >
                    🔄 Try Again
                  </button>
                  <p className="error-tip">
                    💡 <strong>Tip:</strong> If this keeps happening, try
                    refreshing the page or check your internet connection.
                  </p>
                </div>
              </div>
            ) : seriesDetails ? (
              <div className="series-details">
                <div className="series-details-header">
                  <img
                    src={
                      seriesDetails.Poster !== "N/A"
                        ? seriesDetails.Poster
                        : "https://via.placeholder.com/300x450"
                    }
                    alt={seriesDetails.Title}
                    className="series-details-poster"
                  />
                  <div className="series-details-info">
                    <h2>{seriesDetails.Title}</h2>
                    <p className="series-year">{seriesDetails.Year}</p>
                    <p className="series-rating">
                      ⭐ {seriesDetails.imdbRating}/10
                    </p>
                    <p className="series-runtime">{seriesDetails.Runtime}</p>
                    <p className="series-genre">{seriesDetails.Genre}</p>
                    <p className="series-director">
                      Creator: {seriesDetails.Director}
                    </p>
                    <p className="series-actors">
                      Cast: {seriesDetails.Actors}
                    </p>

                    {/* TV Series specific info */}
                    {seriesDetails.totalSeasons && (
                      <p className="series-seasons">
                        📺 {seriesDetails.totalSeasons} Season
                        {seriesDetails.totalSeasons > 1 ? "s" : ""}
                      </p>
                    )}

                    {/* Trailer Button */}
                    <button
                      className="trailer-btn series-trailer-btn"
                      onClick={openTrailer}
                    >
                      🎬 Watch Trailer
                    </button>
                  </div>
                </div>

                <div className="series-details-plot">
                  <h3>Plot</h3>
                  <p>{seriesDetails.Plot}</p>
                </div>

                <div className="series-details-awards">
                  <h3>Awards</h3>
                  <p>
                    {seriesDetails.Awards || "No awards information available"}
                  </p>
                </div>

                {/* TV Series specific sections */}
                <div className="series-details-seasons">
                  <h3>📺 Series Information</h3>
                  <div className="series-stats">
                    {seriesDetails.totalSeasons && (
                      <div className="stat-item">
                        <span className="stat-label">Total Seasons:</span>
                        <span className="stat-value">
                          {seriesDetails.totalSeasons}
                        </span>
                      </div>
                    )}
                    {seriesDetails.Runtime && (
                      <div className="stat-item">
                        <span className="stat-label">Episode Runtime:</span>
                        <span className="stat-value">
                          {seriesDetails.Runtime}
                        </span>
                      </div>
                    )}
                    {seriesDetails.Year && (
                      <div className="stat-item">
                        <span className="stat-label">First Aired:</span>
                        <span className="stat-value">{seriesDetails.Year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="modal-overlay trailer-overlay" onClick={closeModal}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
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
                      window.open(
                        `https://www.google.com/search?q=${encodeURIComponent(
                          searchQuery
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    🔍 Search for Trailer
                  </button>
                </div>
                <div className="trailer-tips">
                  <p>
                    <strong>💡 Tips:</strong>
                  </p>
                  <ul>
                    <li>
                      Click "Watch on YouTube" to open the official trailer
                    </li>
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

export default TVSeriesCard;
