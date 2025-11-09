import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../controller/authcontroller";
import Button from "../../../components/button";
// import Card from "../../../components/Card/Card";
import "./loginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const res = await loginUser({ email, password });
    if (res.success) {
      navigate("/onboarding/skills");
    } else {
      setErr(res.message || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      {/* Left side */}
      {/* <div className="auth-left">
        <h1 className="logo">SKILLSYNC</h1>
        <div className="card-stack">
          <div className="card-layer layer-1">
            <Card bg="#7e7e7e">Some Random Info</Card>
          </div>
          <div className="card-layer layer-2">
            <Card bg="#bcbcbc">Some Random Info</Card>
          </div>
          <div className="card-layer layer-3">
            <Card bg="#d9d9d9" borderColor="#3f82ff">
              Some Random Info
            </Card>
          </div>
          <div className="card-layer layer-4">
            <Card bg="#ececec">Some Random Info</Card>
          </div>
        </div>
      </div> */}

      {/* Right side */}
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <div className="auth-sub">Sign in to your Skill Sync account</div>
          {err && <p className="error-msg">{err}</p>}

          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Button fullWidth type="submit" disabled={!email || !password}>
            Sign In
          </Button>

          <div className="auth-note">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}