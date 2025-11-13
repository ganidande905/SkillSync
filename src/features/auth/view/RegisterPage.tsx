import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../controller/authcontroller";
import Button from "../../../components/button";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    const res = await registerUser({ name, email, password });
    if (res.success) {
      navigate("/login");
    } else {
      setErr(res.message || "Registration failed");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <div className="auth-sub">Join Skill Sync to find your perfect team</div>
        {err && <p className="error-msg">{err}</p>}

        <label>Name</label>
        <input
          type="text"
          className="auth-input"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>College Name</label>
        <input
          type="text"
          className="auth-input"
          placeholder="Enter your college name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          className="auth-input"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        <Button 
          type="submit" 
          variant="primary"
          size="medium"
          fullWidth
          disabled={!name || !email || !password || !confirmPassword}
        >
          Create Account
        </Button>

        <div className="auth-note">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
