import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import TVSeriesCard from "./TVSeriesCard";
import Navigation from "./Navigation";
import SearchIcon from "./search.svg";
import LoginPage from "./LoginPage";

import "./App.css";

const API_URL = "http://localhost:5000/api";
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

  useEffect(() => {
    searchMovies("BatMan", 1);
  }, []);

  const searchMovies = async (title, page = 1) => {
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          title
        )}&page=${page}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch movies");
      }

      console.log("API Response:", data); // Debug log

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching movies:", error);
      setError(error.message);
      setMovies([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const searchByGenre = async (genre, page = 1) => {
    setLoading(true);
    setError("");
    setSelectedGenre(genre);

    try {
      // Search for popular movies in that genre
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

      const searchTerm = searchTerms[genre.id] || genre.name;
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          searchTerm
        )}&page=${page}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch movies");
      }

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching by genre:", error);
      setError(error.message);
      setMovies([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const searchTVSeries = async (title, page = 1) => {
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/movies/search?title=${encodeURIComponent(
          title
        )}&page=${page}&type=series`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch TV series");
      }

      setMovies(data.Search || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching TV series:", error);
      setError(error.message);
      setMovies([]);
      setPagination(null);
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
                  <button
                    className="back-to-genres-btn"
                    onClick={() => setSelectedGenre(null)}
                  >
                    ← Back to Genres
                  </button>
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
        <h1 style={{ margin: 0 }}>MovieLand</h1>

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
