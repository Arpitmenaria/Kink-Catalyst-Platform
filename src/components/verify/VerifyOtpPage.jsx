import VerifyOtpForm from './VerifyOtpForm';
import HeroPanel from '../signup/HeroPanel';
import '../signup/SignupPage.css';
import './VerifyOtpPage.css';

export default function VerifyOtpPage() {
  return (
    <div className="signup-page">
      <VerifyOtpForm />
      <HeroPanel />
    </div>
  );
}
