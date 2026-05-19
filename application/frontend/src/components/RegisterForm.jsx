import { useState } from 'react'

export default function RegisterForm({ onSwitchToLogin }) {
    const [form, setForm] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false,
    })

    function handleChange(e) {
        const { name, value, type, checked } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const fullNameValid = form.fullName.trim().length > 0
    const usernameValid = /^[A-Za-z]{5,}$/.test(form.username)
    const emailValid = form.email.endsWith('@sfsu.edu')

    const passwordValid =
        form.password.length >= 8 &&
        /[0-9]/.test(form.password) &&
        /[!@#$%^&*]/.test(form.password)

    const passwordsMatch =
        form.confirmPassword.length > 0 &&
        form.password === form.confirmPassword

    const formValid =
        fullNameValid &&
        usernameValid &&
        emailValid &&
        passwordValid &&
        passwordsMatch &&
        form.agreedToTerms

    function getInputClass(value, isValid) {
        if (!value) return 'login-input'
        return isValid ? 'login-input valid-input' : 'login-input invalid-input'
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formValid) {
            return;
        }

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullname: form.fullName,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Registration failed");
                return;
            }

            onSwitchToLogin();

        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit} noValidate>
            <input
                className={getInputClass(form.fullName, fullNameValid)}
                type="text"
                name="fullName"
                placeholder="Full Name *" 
                value={form.fullName}
                onChange={handleChange}
            />
            <input
                className={getInputClass(form.username, usernameValid)}
                type="text"
                name="username"
                placeholder="Username * "
                value={form.username}
                onChange={handleChange}
            />

            {form.username && (
                <p className={usernameValid ? 'valid' : 'invalid'}>
                    {usernameValid ? '✓' : '✗'} At least 5 letters, no numbers or symbols
                </p>
            )}
            <input
                className={getInputClass(form.email, emailValid)}
                type="email"
                name="email"
                placeholder="SFSU Email *"
                value={form.email}
                onChange={handleChange}
            />
            {form.email && (
                <p className={emailValid ? 'valid' : 'invalid'}>
                    {emailValid ? '✓' : '✗'} Must use @sfsu.edu email
                </p>
            )}
            <input
                className={getInputClass(form.password, passwordValid)}
                type="password"
                name="password"
                placeholder="Password *"
                value={form.password}
                onChange={handleChange}
            />

            {form.password && (
                <p className={passwordValid ? 'valid' : 'invalid'}>
                    {passwordValid ? '✓' : '✗'} 8+ chars, 1+ number, 1+ special character
                </p>
            )}
            <input
                className={getInputClass(form.confirmPassword, passwordsMatch)}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={form.confirmPassword}
                onChange={handleChange}
            />

            {form.confirmPassword && (
                <p className={passwordsMatch ? 'valid' : 'invalid'}>
                    {passwordsMatch ? '✓' : '✗'} Passwords must match
                </p>
            )}
            <label className="terms-checkbox">
                <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={form.agreedToTerms}
                    onChange={handleChange}
                />{' '}
                I agree to the <a href="#" onClick={(e) => { e.preventDefault(); }} role="link" aria-disabled="true">terms</a>
            </label>
            <p1 className="required-note"><span className="required">*</span> Required fields</p1>
            <button className="login-btn" type="submit" disabled={!formValid}>
                Sign Up
            </button>

            <div className="login-links">
                <button
                    type="button"
                    className="login-link"
                    onClick={onSwitchToLogin}
                >
                    Already have an account? Log In
                </button>
            </div>
        </form>
    )
}