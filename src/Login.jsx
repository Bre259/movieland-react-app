import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const posters = [
  // Action
  "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // Inception
  // Comedy
  "https://m.media-amazon.com/images/M/MV5BMTkzOTQ2NjYyMF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // The Hangover
  // Drama
  "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // The Shawshank Redemption
  // Horror
  "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // The Conjuring
  // Romance
  "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // The Notebook
  // Sci-Fi
  "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwODI5OTM0NA@@._V1_SX300.jpg", // Interstellar
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    // Simple localStorage authentication for now
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === email && user.password === password) {
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    } else {
      setError("Invalid email or password. Please register first.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>MovieLand</h1>
        <p>Welcome back! Sign in to continue</p>
      </div>
      
      <div className="poster-showcase">
        {posters.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Movie Poster"
            className="showcase-poster"
          />
        ))}
      </div>

      <div className="auth-form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
          </div>
          <button type="submit" className="auth-btn primary">Sign In</button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <div className="auth-links">
          <Link to="/register">Create an account</Link>
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
