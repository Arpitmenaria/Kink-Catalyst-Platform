import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearAuthState, resetToSignup } from '../../store/slices/authSlice';
import OtpInput from './OtpInput';

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

export default function VerifyOtpForm() {
  const dispatch = useDispatch();
  const { loading, resendLoading, error, successMessage, registrationData } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  function handleOtpChange(val) {
    setOtp(val);
    if (error || successMessage) dispatch(clearAuthState());
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) return;
    dispatch(verifyOtp(otp));
  }

  function handleResend() {
    dispatch(resendOtp());
    setOtp('');
  }

  function handleBack() {
    dispatch(resetToSignup());
  }

  return (
    <div className="signup-left-panel">
      <div className="signup-logo">SocialPlatform</div>

      <div className="signup-form-wrapper">
        <div className="signup-card verify-card">
          <button
            type="button"
            className="back-btn"
            onClick={handleBack}
            disabled={loading}
          >
            ← Back to login
          </button>

          <div className="signup-card-header verify-header">
            <h1 className="signup-title">Verification</h1>
            <p className="signup-subtitle">
              We&apos;ve sent a code to{' '}
              <span className="email-highlight">{registrationData?.email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              disabled={loading}
            />

            {error && (
              <p className="form-message form-message--error" role="alert">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="form-message form-message--success" role="status">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || otp.length < 6}
            >
              {loading ? <><Spinner /> Verifying…</> : 'Verify'}
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
              {resendLoading ? 'Sending…' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
