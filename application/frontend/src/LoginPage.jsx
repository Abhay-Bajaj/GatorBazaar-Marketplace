import LogoSection from './components/LogoSection'
import Title from './components/Title'
import LoginForm from './components/LoginForm'

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-box">
        <LogoSection />
        <Title />
        <LoginForm />
      </div>
    </div>
  )
}
