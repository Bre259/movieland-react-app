import React, { useState } from "react";

const API_URL =
  "https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api";

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

  // Registration with backend
  const handleRegister = async (e) => {
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
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Registration failed");
      } else {
        setRegSuccess("Registration successful! You can now log in.");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
        setIsRegister(false);
      }
    } catch (err) {
      setRegError("Registration failed. Please try again.");
    }
  };

  // Login with backend
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const savedEmail = localStorage.getItem("registeredEmail");
    const savedPassword = localStorage.getItem("registeredPassword");
    // Allow login with registered OR default credentials
    const isRegistered = email === savedEmail && password === savedPassword;
    const isDefault = email === "user@example.com" && password === "586358";
    if (isRegistered || isDefault) {
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
            {error && (
              <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
            )}
            <button type="submit" style={{ width: "100%", padding: 10 }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span>Don't have an account? </span>
            <button
              type="button"
              style={{
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
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
            {regError && (
              <div style={{ color: "red", marginBottom: 16 }}>{regError}</div>
            )}
            {regSuccess && (
              <div style={{ color: "green", marginBottom: 16 }}>
                {regSuccess}
              </div>
            )}
            <button type="submit" style={{ width: "100%", padding: 10 }}>
              Register
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span>Already have an account? </span>
            <button
              type="button"
              style={{
                color: "#007bff",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
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
