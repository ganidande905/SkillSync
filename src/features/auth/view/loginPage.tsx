import React, { useState } from "react";
import { loginUser } from "../controller/authcontroller.js";
import { Link } from "react-router-dom";
import "./loginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await loginUser({ email, password });
    setLoading(false);

    if (res.success) {
      setMessage("Login successful!");
    } else {
      setMessage(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="ss-btn ss-btn-full ss-btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && <p className="error-msg">{message}</p>}
        <p className="auth-note">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
