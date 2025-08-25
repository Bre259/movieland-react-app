import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import TVSeriesCard from "./TVSeriesCard";
import Navigation from "./Navigation";
import SearchIcon from "./search.svg";
import LoginPage from "./LoginPage";
import BackIcon from "./BackIcon";
import BackIconDemo from "./BackIconDemo";
import ApiTestPage from "./ApiTestPage";

import "./App.css";

// API Configuration with fallback
const NETLIFY_API_URL =
  "https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api";
const OMDB_DIRECT_URL = "https://www.omdbapi.com";
const OMDB_API_KEY = "33ac2980";

// Helper function to determine which API to use
const getApiUrl = () => {
  // Try Netlify first, fallback to local if needed
  return NETLIFY_API_URL;
};

const API_URL = getApiUrl();
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [watchlist, setWatchlist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [apiStatus, setApiStatus] = useState("unknown"); // 'netlify', 'fallback', 'unknown'

  const genres = [
    { id: "action", name: "Action", icon: "💥", color: "#ff6b6b" },
    { id: "adventure", name: "Adventure", icon: "🗺️", color: "#4ecdc4" },
    { id: "comedy", name: "Comedy", icon: "😂", color: "#45b7d1" },
    { id: "drama", name: "Drama", icon: "🎭", color: "#96ceb4" },
    { id: "horror", name: "Horror", icon: "👻", color: "#feca57" },
    { id: "romance", name: "Romance", icon: "💕", color: "#ff9ff3" },
    { id: "sci-fi", name: "Sci-Fi", icon: "🚀", color: "#54a0ff" },
    { id: "thriller", name: "Thriller", icon: "😱", color: "#5f27cd" },
    { id: "fantasy", name: "Fantasy", icon: "🐉", color: "#00d2d3" },
    { id: "animation", name: "Animation", icon: "🎨", color: "#ff9f43" },
    { id: "documentary", name: "Documentary", icon: "📹", color: "#10ac84" },
    { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦", color: "#ff6348" },
  ];

  // Test API connectivity
  const testApiConnectivity = async () => {
    console.log("Testing API connectivity...");

    // Test Netlify Functions
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Netlify Functions working:", data);
        return "netlify";
      } else {
        console.warn("❌ Netlify Functions not responding:", response.status);
      }
    } catch (error) {
      console.warn("❌ Netlify Functions error:", error.message);
    }

    // Test direct OMDB API
    try {
      const response = await fetch(
        `${OMDB_DIRECT_URL}?apikey=${OMDB_API_KEY}&s=batman&page=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.Response === "True") {
          console.log(
            "✅ Direct OMDB API working:",
            data.totalResults,
            "results"
          );
          return "direct";
        } else {
          console.warn("❌ OMDB API returned error:", data.Error);
        }
      } else {
        console.warn("❌ OMDB API not responding:", response.status);
      }
    } catch (error) {
      console.warn("❌ Direct OMDB API error:", error.message);
    }

    return "none";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Test API connectivity on app load
    const initializeApp = async () => {
      try {
        await testApiConnectivity();
        await searchMovies("BatMan", 1);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is intentional for initialization

  // Fallback function for direct OMDB API calls
  const searchMoviesDirectly = async (title, page = 1, type = null) => {
    try {
      let searchUrl = `${OMDB_DIRECT_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
        title
      )}&page=${page}`;
      if (type) {
        searchUrl += `&type=${type}`;
      }

      console.log("Attempting to fetch from:", searchUrl);
      const response = await fetch(searchUrl);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.Response === "False") {
        throw new Error(data.Error || "No movies found");
      }

      // Add pagination info to match expected format
      const totalResults = parseInt(data.totalResults) || 0;
      const resultsPerPage = 10;
      const totalPages = Math.ceil(totalResults / resultsPerPage);
      const currentPage = parseInt(page);

      return {
        ...data,
        pagination: {
          currentPage,
          totalPages,
          totalResults,
          resultsPerPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };
    } catch (error) {
      throw new Error(`Direct API call failed: ${error.message}`);
    }
  };

  const searchMovies = async (title, page = 1) => {
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      // First try Netlify Functions
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          title
        )}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("API Response:", data); // Debug log

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
      setApiStatus("netlify");
    } catch (error) {
      console.warn(
        "Netlify Functions failed, trying direct OMDB API:",
        error.message
      );

      try {
        // Fallback to direct OMDB API
        const data = await searchMoviesDirectly(title, page);
        console.log("Fallback API Response:", data);

        setMovies(data.Search || []);
        setPagination(data.pagination);
        setCurrentPage(page);
        setApiStatus("fallback");

        // Show a informational message that we're using fallback
        console.info(
          "✅ Using direct OMDB API as fallback - app functioning normally"
        );
      } catch (fallbackError) {
        console.error("Both APIs failed:", fallbackError);
        if (fallbackError.message.includes("Failed to fetch")) {
          setError(
            `Connection failed. Please check your internet connection and try again.`
          );
        } else {
          setError(`Failed to fetch movies: ${fallbackError.message}`);
        }
        setMovies([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchByGenre = async (genre, page = 1) => {
    setLoading(true);
    setError("");
    setSelectedGenre(genre);

    // Search terms mapping for different genres
    const searchTerms = {
      action: "action movie",
      adventure: "adventure movie",
      comedy: "comedy movie",
      drama: "drama movie",
      horror: "horror movie",
      romance: "romance movie",
      "sci-fi": "science fiction movie",
      thriller: "thriller movie",
      fantasy: "fantasy movie",
      animation: "animated movie",
      documentary: "documentary",
      family: "family movie",
    };

    try {
      // First try Netlify Functions
      const searchTerm = searchTerms[genre.id] || genre.name;
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          searchTerm
        )}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.warn(
        "Netlify Functions failed for genre search, trying direct OMDB API:",
        error.message
      );

      try {
        // Fallback to direct OMDB API
        const searchTerm = searchTerms[genre.id] || genre.name;
        const data = await searchMoviesDirectly(searchTerm, page);

        setMovies(data.Search || []);
        setPagination(data.pagination);
        setCurrentPage(page);
      } catch (fallbackError) {
        console.error("Both APIs failed for genre search:", fallbackError);
        setError(`Failed to search by genre: ${fallbackError.message}`);
        setMovies([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchTVSeries = async (title, page = 1) => {
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      // First try Netlify Functions
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          title
        )}&page=${page}&type=series`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.warn(
        "Netlify Functions failed for TV series, trying direct OMDB API:",
        error.message
      );

      try {
        // Fallback to direct OMDB API
        const data = await searchMoviesDirectly(title, page, "series");

        setMovies(data.Search || []);
        setPagination(data.pagination);
        setCurrentPage(page);
      } catch (fallbackError) {
        console.error("Both APIs failed for TV series:", fallbackError);
        setError(`Failed to search TV series: ${fallbackError.message}`);
        setMovies([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSelectedGenre(null);
    if (activeTab === "tvseries") {
      searchTVSeries(searchTerm, 1);
    } else {
      searchMovies(searchTerm, 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const goToNextPage = () => {
    if (pagination && pagination.hasNextPage) {
      if (selectedGenre) {
        searchByGenre(selectedGenre, currentPage + 1);
      } else if (activeTab === "tvseries") {
        searchTVSeries(searchTerm || "BatMan", currentPage + 1);
      } else {
        searchMovies(searchTerm || "BatMan", currentPage + 1);
      }
    }
  };

  const goToPrevPage = () => {
    if (pagination && pagination.hasPrevPage) {
      if (selectedGenre) {
        searchByGenre(selectedGenre, currentPage - 1);
      } else if (activeTab === "tvseries") {
        searchTVSeries(searchTerm || "BatMan", currentPage - 1);
      } else {
        searchMovies(searchTerm || "BatMan", currentPage - 1);
      }
    }
  };

  const goToPage = (page) => {
    if (selectedGenre) {
      searchByGenre(selectedGenre, page);
    } else if (activeTab === "tvseries") {
      searchTVSeries(searchTerm || "BatMan", page);
    } else {
      searchMovies(searchTerm || "BatMan", page);
    }
  };

  const addToWatchlist = (movie) => {
    if (!watchlist.find((item) => item.imdbID === movie.imdbID)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter((item) => item.imdbID !== movieId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="home-section">
            <h2>Welcome to MovieLand! 🎬</h2>
            <div className="home-content">
              <div className="featured-section">
                <h3>Featured Movies</h3>
                <div className="featured-movies">
                  {movies.slice(0, 6).map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "movies":
        return (
          <div className="movies-section">
            <div className="search">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for movies..."
              />
              <img src={SearchIcon} alt="search" onClick={handleSearch} />
            </div>
            {renderMovieGrid()}
          </div>
        );

      case "tvseries":
        return (
          <div className="tvseries-section">
            <div className="search">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for TV series..."
              />
              <img src={SearchIcon} alt="search" onClick={handleSearch} />
            </div>
            {renderTVSeriesGrid()}
          </div>
        );

      case "watchlist":
        return (
          <div className="watchlist-section">
            <h2>My Watchlist 📋</h2>
            {watchlist.length === 0 ? (
              <div className="empty">
                <h3>Your watchlist is empty</h3>
                <p>Add movies to your watchlist to see them here!</p>
                <button
                  onClick={() => setActiveTab("movies")}
                  className="action-btn"
                >
                  🎬 Browse Movies
                </button>
              </div>
            ) : (
              <div className="container">
                {watchlist.map((item) => (
                  <div key={item.imdbID} className="watchlist-item">
                    {item.Type === "series" ? (
                      <TVSeriesCard series={item} />
                    ) : (
                      <MovieCard movie={item} />
                    )}
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWatchlist(item.imdbID)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "more":
        return (
          <div className="more-section">
            <h2>More Options ⚙️</h2>
            <div className="more-options">
              <div
                className="option-card"
                onClick={() => setActiveTab("genres")}
              >
                <h3>🎭 Genres</h3>
                <p>Browse movies by genre</p>
                <button className="option-btn">Browse Genres</button>
              </div>
              <div
                className="option-card"
                onClick={() => setActiveTab("back-icon-demo")}
              >
                <h3>← BackIcon Demo</h3>
                <p>Explore the BackIcon component</p>
                <button className="option-btn">View Demo</button>
              </div>
              <div
                className="option-card"
                onClick={() => setActiveTab("api-test")}
              >
                <h3>🔍 API Test</h3>
                <p>Test API connectivity</p>
                <button className="option-btn">Run Tests</button>
              </div>
              <div className="option-card">
                <h3>📅 Release Year</h3>
                <p>Filter by release year</p>
                <button className="option-btn">Coming Soon</button>
              </div>
              <div className="option-card">
                <h3>⭐ Ratings</h3>
                <p>Top rated movies</p>
                <button className="option-btn">Coming Soon</button>
              </div>
              <div className="option-card">
                <h3>🏆 Awards</h3>
                <p>Award-winning films</p>
                <button className="option-btn">Coming Soon</button>
              </div>
            </div>
          </div>
        );

      case "genres":
        return (
          <div className="genres-section">
            <h2>Browse by Genre 🎭</h2>
            {selectedGenre ? (
              <div className="genre-results">
                <div className="genre-header">
                  <BackIcon
                    onClick={() => setSelectedGenre(null)}
                    label="Back to Genres"
                    className="secondary"
                    iconStyle="arrow"
                  />
                  <h3>
                    {selectedGenre.icon} {selectedGenre.name} Movies
                  </h3>
                </div>
                {renderMovieGrid()}
              </div>
            ) : (
              <div className="genres-grid">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="genre-card"
                    onClick={() => searchByGenre(genre, 1)}
                    style={{ "--genre-color": genre.color }}
                  >
                    <div className="genre-icon">{genre.icon}</div>
                    <h3 className="genre-name">{genre.name}</h3>
                    <p className="genre-description">
                      Discover amazing {genre.name.toLowerCase()} movies
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "back-icon-demo":
        return <BackIconDemo onClose={() => setActiveTab("more")} />;

      case "api-test":
        return <ApiTestPage onBack={() => setActiveTab("more")} />;

      default:
        return null;
    }
  };

  const renderMovieGrid = () => {
    return (
      <>
        {loading && (
          <div className="empty">
            <h2>Searching...</h2>
          </div>
        )}

        {error && (
          <div className="empty">
            <h2>Error: {error}</h2>
          </div>
        )}

        {!loading && !error && movies?.length > 0 && (
          <>
            <div className="container">
              {movies.map((movie) => (
                <div key={movie.imdbID} className="movie-wrapper">
                  <MovieCard movie={movie} />
                  <button
                    className="add-to-watchlist-btn"
                    onClick={() => addToWatchlist(movie)}
                  >
                    ➕ Add to Watchlist
                  </button>
                </div>
              ))}
            </div>

            {/* Debug info */}
            {pagination && (
              <div
                style={{
                  color: "#f9d3b4",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Debug: Page {pagination.currentPage} of {pagination.totalPages}{" "}
                | Total: {pagination.totalResults} movies
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <span>Total: {pagination.totalResults} movies</span>
                </div>

                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            className={`page-btn ${
                              pageNum === pagination.currentPage ? "active" : ""
                            }`}
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Show message if no pagination */}
            {pagination && pagination.totalPages <= 1 && (
              <div
                style={{
                  color: "#f9d3b4",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Only one page of results available
              </div>
            )}
          </>
        )}

        {!loading && !error && movies?.length === 0 && (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )}
      </>
    );
  };

  const renderTVSeriesGrid = () => {
    return (
      <>
        {loading && (
          <div className="empty">
            <h2>Searching for TV series...</h2>
          </div>
        )}

        {error && (
          <div className="empty">
            <h2>Error: {error}</h2>
          </div>
        )}

        {!loading && !error && movies?.length > 0 && (
          <>
            <div className="container">
              {movies.map((series) => (
                <div key={series.imdbID} className="series-wrapper">
                  <TVSeriesCard series={series} />
                  <button
                    className="add-to-watchlist-btn"
                    onClick={() => addToWatchlist(series)}
                  >
                    ➕ Add to Watchlist
                  </button>
                </div>
              ))}
            </div>

            {/* Debug info */}
            {pagination && (
              <div
                style={{
                  color: "#f9d3b4",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Debug: Page {pagination.currentPage} of {pagination.totalPages}{" "}
                | Total: {pagination.totalResults} series
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <span>Total: {pagination.totalResults} series</span>
                </div>

                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            className={`page-btn ${
                              pageNum === pagination.currentPage ? "active" : ""
                            }`}
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Show message if no pagination */}
            {pagination && pagination.totalPages <= 1 && (
              <div
                style={{
                  color: "#f9d3b4",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Only one page of results available
              </div>
            )}
          </>
        )}

        {!loading && !error && movies?.length === 0 && (
          <div className="empty">
            <h2>No TV series found</h2>
          </div>
        )}
      </>
    );
  };

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ margin: 0 }}>MovieLand</h1>
          {apiStatus === "fallback" && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#feca57",
                backgroundColor: "rgba(254, 202, 87, 0.1)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(254, 202, 87, 0.3)",
              }}
              title="Using direct OMDB API - Netlify Functions unavailable"
            >
              ⚠️ Fallback Mode
            </span>
          )}
        </div>

        {/* Navigation and logout grouped in the same bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <button
            onClick={() => {
              setLoggedIn(false);
              try {
                localStorage.removeItem("loggedIn");
              } catch (e) {}
            }}
            className="logout-btn"
            style={{ padding: "8px 12px" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default App;
