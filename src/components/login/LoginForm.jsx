import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthState } from '../../store/slices/authSlice';
import { showSignup, showForgotPassword } from '../../store/slices/uiSlice';
import { resetForgotPassword } from '../../store/slices/forgotPasswordSlice';

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-47.4-148.2-112.7C46.9 803.8 0 668.8 0 540c0-207.7 135.3-317.5 263.6-317.5 96.5 0 167.8 60.9 220.8 60.9 50.1 0 131.1-64.4 241.3-64.4zM477.6 161.1c14.3-48.9 44.8-99.5 91.4-132.6 12.5-9 37.3-20.8 64-20.8 4.5 0 9 .6 13.5 1.3 0 1.9 0 4.5-.6 7.1-4.5 50.8-36 101.2-88.5 134.3-13.5 8.9-37.3 19.5-62.2 19.5-5.1 0-10.3-.6-18-1.9z"/>
    </svg>
  );
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearAuthState()); };
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthState());
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUser({ email: form.email, password: form.password }));
  }

  return (
    <div className="signup-left-panel">
      <div className="signup-logo">SocialPlatform</div>

      <div className="signup-form-wrapper">
        <div className="signup-card">
          <div className="signup-card-header">
            <h1 className="signup-title">Welcome back</h1>
            <p className="signup-subtitle">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>

            <div className="login-remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  className="remember-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <button
                type="button"
                className="forgot-link"
                style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', padding: 0 }}
                onClick={() => { dispatch(resetForgotPassword()); dispatch(showForgotPassword()); }}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="form-message form-message--error" role="alert">{error}</p>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '16px 0 14px' }}><span>Or sign in with</span></div>

          <div className="social-buttons">
            <button type="button" className="social-btn" disabled={loading}>
              <GoogleIcon /> Google
            </button>
            <button type="button" className="social-btn" disabled={loading}>
              <AppleIcon /> Apple
            </button>
          </div>

          <p className="signin-text" style={{ marginTop: '16px' }}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="inline-link-btn"
              onClick={() => dispatch(showSignup())}
              disabled={loading}
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
