/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  registerUser,
  fetchUniversitySuggestions,
} from "../controller/authcontroller.js";
import { Link } from "react-router-dom";
import "./loginPage.css";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch universities (debounced)
  useEffect(() => {
    if (!university.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const list = await fetchUniversitySuggestions(university);
        setSuggestions(list || []);
      } catch (err) {
        // silently ignore for now
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [university]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await registerUser({ email, name, university, password });
    setLoading(false);

    if (res.success) {
      setMessage("Registration successful! You can now login.");
    } else {
      setMessage(res.message || "Registration failed");
    }
  };

  const handleSuggestionClick = (selectedUniversity: string) => {
    setUniversity(selectedUniversity);
    setSuggestions([]);
  };

  return (
    <div className="auth-page">
      {/* background orbs + noise */}
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />
      <div className="auth-noise" />

      <div className="auth-shell">
        {/* Left side hero (same language as login, but for sign up) */}
        <div className="auth-hero">
          <div className="auth-logo-pill">
            <span className="auth-dot" />
            <span className="auth-logo-text">SkillSync</span>
          </div>
          <h1 className="auth-title">Create your SkillSync profile.</h1>
          <p className="auth-subtitle">
            Set up your account, connect your university, and get ready to be
            matched with teams, tracks, and projects that align with who you
            are.
          </p>

          <div className="auth-status-chip">
            <span className="status-pulse" />
            <span>Account creation · Secure & private</span>
          </div>
        </div>

        {/* Right side: glass card */}
        <form className="auth-card" onSubmit={handleRegister}>
          <div className="auth-card-header">
            <h2>Register</h2>
            <p>It only takes a minute to get started.</p>
          </div>

          {/* Email */}
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

          {/* Name */}
          <div className="auth-field">
            <label htmlFor="name">Name</label>
            <div className="auth-input-shell">
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="Your full name"
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* University + suggestions */}
          <div className="auth-field university-container">
            <label htmlFor="university">University (India)</label>
            <div className="auth-input-shell">
              <input
                id="university"
                type="text"
                className="auth-input"
                placeholder="Start typing your university..."
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(s)}
                    onMouseDown={(e) => e.preventDefault()} // keeps input focus
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-shell">
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="ss-btn ss-btn-full ss-btn-primary ss-btn-medium auth-primary-btn"
            disabled={loading}
            type="submit"
          >
            <span className="btn-label">
              {loading ? "Registering..." : "Create account"}
            </span>
            <span className="btn-accent-orb" />
          </button>

          {message && <p className="error-msg">{message}</p>}

          <p className="auth-note">
            Already have an account?
            <Link to="/"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;