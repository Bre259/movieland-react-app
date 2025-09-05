import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Forgot Password</h2>
      {submitted ? (
        <div style={{ color: 'green' }}>
          If this email is registered, you will receive password reset instructions (demo only).
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit">Send Reset Link</button>
        </form>
      )}
      <div style={{ marginTop: 10 }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
