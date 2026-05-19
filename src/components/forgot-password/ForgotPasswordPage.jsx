import { useSelector } from 'react-redux';
import ForgotEmailForm from './ForgotEmailForm';
import ForgotOtpForm from './ForgotOtpForm';
import ResetPasswordForm from './ResetPasswordForm';
import HeroPanel from '../signup/HeroPanel';
import '../signup/SignupPage.css';
import '../verify/VerifyOtpPage.css';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const { step } = useSelector((s) => s.forgotPassword);

  const FormComponent = {
    email: ForgotEmailForm,
    otp:   ForgotOtpForm,
    reset: ResetPasswordForm,
    done:  ResetPasswordForm,
  }[step] ?? ForgotEmailForm;

  return (
    <div className="signup-page">
      <FormComponent />
      <HeroPanel />
    </div>
  );
}
