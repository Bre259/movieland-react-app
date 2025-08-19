import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // For demo: store registered user in localStorage
  const handleRegister = (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    if (!regEmail || !regPassword) {
      setRegError("Please fill all fields");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match");
      return;
    }
    // Save to localStorage (for demo only)
    localStorage.setItem("registeredEmail", regEmail);
    localStorage.setItem("registeredPassword", regPassword);
    setRegSuccess("Registration successful! You can now log in.");
    setRegEmail("");
    setRegPassword("");
    setRegConfirm("");
    setIsRegister(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    // Check against registered user in localStorage
    const savedEmail = localStorage.getItem("registeredEmail") || "user@example.com";
    const savedPassword = localStorage.getItem("registeredPassword") || "586358";
    if (email === savedEmail && password === savedPassword) {
      setError("");
      if (onLogin) onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      {!isRegister ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 10 }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span>Don't have an account? </span>
            <button
              type="button"
              style={{ color: "#007bff", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label>Email:</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Password:</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            {regError && <div style={{ color: "red", marginBottom: 16 }}>{regError}</div>}
            {regSuccess && <div style={{ color: "green", marginBottom: 16 }}>{regSuccess}</div>}
            <button type="submit" style={{ width: "100%", padding: 10 }}>
              Register
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span>Already have an account? </span>
            <button
              type="button"
              style={{ color: "#007bff", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setIsRegister(false)}
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
