import { useState } from 'react'

export default function ForgotLoginForm({ onSwitchToLogin }) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const emailValid = email.endsWith('@sfsu.edu')

    function handleSubmit(e) {
        e.preventDefault()

        if (!emailValid) {
            setMessage('Please enter a valid SFSU email.')
            return
        }

        setMessage('If this email is connected to an account, a recovery link will be sent.')
    }

    return (
        <form className="login-form" onSubmit={handleSubmit} noValidate>
            <p className="login-helper-text">
                Enter the email associated with your account. We will send a recovery link.
            </p>

            <input
                className={
                    email
                        ? emailValid
                            ? 'login-input valid-input'
                            : 'login-input invalid-input'
                        : 'login-input'
                }
                type="email"
                placeholder="SFSU Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {email && (
                <p className={emailValid ? 'valid' : 'invalid'}>
                    {emailValid ? '✓' : '✗'} Must use @sfsu.edu email
                </p>
            )}

            {message && <p className="login-error">{message}</p>}

            <button className="login-btn" type="submit" disabled={!emailValid}>
                Send Recovery Link
            </button>

            <div className="login-links">
                <button type="button" className="login-link" onClick={onSwitchToLogin}>
                    Back to Log In
                </button>
            </div>
        </form>
    )
}