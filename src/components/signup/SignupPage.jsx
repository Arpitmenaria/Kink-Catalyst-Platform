import SignupForm from './SignupForm';
import HeroPanel from './HeroPanel';
import './SignupPage.css';

export default function SignupPage() {
  return (
    <div className="signup-page">
      <SignupForm />
      <HeroPanel />
    </div>
  );
}
