import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus"

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();

  if (!username.trim() || !password.trim()) {
    setError('Please fill in both fields.');
    return;
  }

  try {
    setError('');

    const response = await fetch("/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess()
    } else {
      navigate('/dashboard')
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setError("Server error");
  }
}

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {error && <p className="login-error">{error}</p>}

      <button className="login-btn" type="submit">
        Login
      </button>

      <div className="login-links">
        <button
          type="button"
          className="login-link"
          onClick={onSwitchToForgot}
        >
          Forgot Log In?
        </button>

        <button
          type="button"
          className="login-link"
          onClick={onSwitchToRegister}
        >
          Need an Account? Sign Up
        </button>
      </div>
    </form>
  )
}