import { useEffect, useState } from 'react'
import LogoSection from './LogoSection'
import Title from './Title'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotLoginForm from './ForgotLoginForm'

export default function LoginModal({ onClose, isOpen = true }) {
  const [mode, setMode] = useState('login')

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="login-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={
        mode === 'login'
          ? 'Login'
          : mode === 'register'
            ? 'Create account'
            : 'Forgot login'
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="login-modal-box">
        <button
          className="login-modal-close"
          type="button"
          aria-label="Close login"
          onClick={onClose}
        >
          ✕
        </button>

        <LogoSection />
        <Title />

        {mode === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgot={() => setMode('forgot')}
          />
        )}

        {mode === 'register' && (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}

        {mode === 'forgot' && (
          <ForgotLoginForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}