import React, { useState } from "react";
import { registerUser } from "../controller/authcontroller.js";
import { Link } from "react-router-dom";


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await registerUser({ email, name, password });
    setLoading(false);

    if (res.success) {
      setMessage("Registration successful! You can now login.");
    } else {
      setMessage(res.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="auth-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="ss-btn ss-btn-full ss-btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {message && <p className="error-msg">{message}</p>}
        <p className="auth-note">
          Already have an account?
          <Link to="/"> Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
