import { useState } from 'react'

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setError('')
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