import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    // Simple localStorage registration for now
    localStorage.setItem("user", JSON.stringify({ email, password }));
    setSuccess("Registration successful! Please login.");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="app" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
      <div style={{ marginTop: 10 }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default Register;
