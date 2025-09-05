import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import { Routes, Route, useNavigate } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import LoadingSpinner from "./LoadingSpinner";

import "./App.css";
import MovieDetail from "./MovieDetail";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

const API_URL = "http://www.omdbapi.com?apikey=33ac2980";

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    searchMovies("BatMan", 1);
  }, []);

  const searchMovies = async (title, pageNum = 1) => {
    setLoading(true);
    setSearchLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${pageNum}`);
      const data = await response.json();
      setMovies(data.Search || []);
      setTotalResults(parseInt(data.totalResults) || 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "/login";
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="app">
      <div className="header-actions">
        <button onClick={handleLogout} className="logout-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
      <h1>MovieLand</h1>
      <nav className="category-nav">
        {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'].map((cat) => (
          <button
            key={cat}
            className="category-btn"
            onClick={() => { setSearchTerm(cat); searchMovies(cat, 1); }}
          >
            {cat}
          </button>
        ))}
      </nav>
      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies(searchTerm, 1)}
          placeholder="Search for movies"
          disabled={searchLoading}
        />
        <div className="search-icon-container">
          {searchLoading ? (
            <div className="search-spinner"></div>
          ) : (
            <img
              src={SearchIcon}
              alt="search"
              onClick={() => searchMovies(searchTerm, 1)}
            />
          )}
        </div>
      </div>
      {loading ? (
        <div className="container">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="container">
            {movies.map((movie) => (
              <div key={movie.imdbID} onClick={() => handleMovieClick(movie.imdbID)} style={{ cursor: 'pointer' }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => searchMovies(searchTerm || "BatMan", page - 1)} 
              disabled={page <= 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Previous
            </button>
            <span className="pagination-info">Page {page} of {totalPages || 1}</span>
            <button 
              className="pagination-btn" 
              onClick={() => searchMovies(searchTerm || "BatMan", page + 1)} 
              disabled={page >= totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="empty">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h2>No movies found</h2>
          <p>Try searching for a different movie or browse by category</p>
        </div>
      )}
    </div>
  );
};

const isAuthenticated = () => localStorage.getItem("loggedIn") === "true";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/" element={isAuthenticated() ? <MovieList /> : <Login />} />
      <Route path="/movie/:imdbID" element={isAuthenticated() ? <MovieDetail /> : <Login />} />
    </Routes>
  );
};

export default App;
