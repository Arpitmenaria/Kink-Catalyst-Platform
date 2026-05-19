import LoginForm from './LoginForm';
import HeroPanel from '../signup/HeroPanel';
import '../signup/SignupPage.css';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="signup-page">
      <LoginForm />
      <HeroPanel />
    </div>
  );
}
