import React, { useState } from "react";
import { loginUser } from "../controller/authcontroller.js";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await loginUser({ email, password });
    setLoading(false);

    if (res.success) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/onboarding/skills");
    } else {
      setMessage(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      {/* animated background blobs */}
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />
      <div className="auth-noise" />

      <div className="auth-shell">
        {/* Left side: brand / hero */}
        <div className="auth-hero">
          <div className="auth-logo-pill">
            <span className="auth-dot" />
            <span className="auth-logo-text">SkillSync</span>
          </div>
          <h1 className="auth-title">Welcome back, creator.</h1>
          <p className="auth-subtitle">
            Sign in to continue building teams, tracking skills, and aligning
            yourself with projects that actually fit you.
          </p>

          <div className="auth-status-chip">
            <span className="status-pulse" />
            <span>Secure session · End-to-end encrypted</span>
          </div>
        </div>

        {/* Right side: glass card */}
        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-card-header">
            <h2>Log in</h2>
            <p>Use your registered email and password to continue.</p>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-shell">
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@university.edu"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-shell">
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="ss-btn ss-btn-full ss-btn-primary ss-btn-medium auth-primary-btn"
            disabled={loading}
            type="submit"
          >
            <span className="btn-label">
              {loading ? "Authenticating..." : "Continue"}
            </span>
            <span className="btn-accent-orb" />
          </button>

          {message && <p className="error-msg">{message}</p>}

          <p className="auth-note">
            Don&apos;t have an account?
            <Link to="/register"> Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;