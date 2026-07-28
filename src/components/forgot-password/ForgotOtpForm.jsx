import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyResetOtp, sendResetOtp, goToStep, clearForgotState } from '../../store/slices/forgotPasswordSlice';
import OtpInput from '../verify/OtpInput';

function Spinner() { return <span className="spinner" aria-hidden="true" />; }

export default function ForgotOtpForm() {
  const dispatch = useDispatch();
  const { loading, error, successMessage, email } = useSelector((s) => s.forgotPassword);
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => () => { dispatch(clearForgotState()); }, [dispatch]);

  function handleOtpChange(val) {
    setOtp(val);
    if (error || successMessage) dispatch(clearForgotState());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) return;
    dispatch(verifyResetOtp(otp));
  }

  async function handleResend() {
    setResendLoading(true);
    await dispatch(sendResetOtp(email));
    setResendLoading(false);
    setOtp('');
  }

  return (
    <div className="signup-left-panel">
      <div className="signup-logo">Kink Analyst</div>

      <div className="signup-form-wrapper">
        <div className="signup-card fp-card verify-card">
          <button
            type="button"
            className="back-btn"
            onClick={() => dispatch(goToStep('email'))}
            disabled={loading}
          >
            â† Back
          </button>

          <div className="signup-card-header verify-header">
            <h1 className="signup-title">Check your email</h1>
            <p className="signup-subtitle">
              We sent a reset code to{' '}
              <span className="email-highlight">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <OtpInput value={otp} onChange={handleOtpChange} disabled={loading} />

            {error && (
              <p className="form-message form-message--error" role="alert">{error}</p>
            )}

            <button type="submit" className="submit-btn" disabled={loading || otp.length < 6}>
              {loading ? <><Spinner /> Verifyingâ€¦</> : 'Verify Code'}
            </button>
          </form>

          <p className="signin-text">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resendLoading || loading}
            >
              {resendLoading ? 'Sendingâ€¦' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


