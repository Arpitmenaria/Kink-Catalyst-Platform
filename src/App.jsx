import { useSelector } from 'react-redux';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';
import ForgotPasswordPage from './components/forgot-password/ForgotPasswordPage';
import VerifyOtpPage from './components/verify/VerifyOtpPage';
import PlansPage from './components/plans/PlansPage';
import HomePage from './components/home/HomePage';

export default function App() {
  const { otpPending, isAuthenticated, requiresPlanSelection, user } = useSelector((state) => state.auth);
  const { planSelectionComplete } = useSelector((state) => state.plans);
  const { page } = useSelector((state) => state.ui);

  if (otpPending) return <VerifyOtpPage />;

  // Logged-in user who hasn't selected a plan yet (login → plan-setup flow)
  if (requiresPlanSelection) return <PlansPage />;

  if (isAuthenticated) {
    const hasPlan = planSelectionComplete || !!user?.membership;
    return hasPlan ? <HomePage /> : <PlansPage />;
  }

  if (page === 'login')           return <LoginPage />;
  if (page === 'forgot-password') return <ForgotPasswordPage />;
  return <SignupPage />;
}
