import { useEffect } from 'react'
import LogoSection from './LogoSection'
import Title from './Title'
import LoginForm from './LoginForm'

export default function LoginModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="login-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
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
        <LoginForm />
      </div>
    </div>
  )
}
