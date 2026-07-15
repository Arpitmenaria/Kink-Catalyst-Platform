import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleLogin, clearAuthState } from '../../store/slices/authSlice';
import { showSignup, showForgotPassword } from '../../store/slices/uiSlice';
import { resetForgotPassword } from '../../store/slices/forgotPasswordSlice';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  || '423673543994-0l046sv4nbb3m7qvb713d44b51npne6f.apps.googleusercontent.com';

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-47.4-148.2-112.7C46.9 803.8 0 668.8 0 540c0-207.7 135.3-317.5 263.6-317.5 96.5 0 167.8 60.9 220.8 60.9 50.1 0 131.1-64.4 241.3-64.4zM477.6 161.1c14.3-48.9 44.8-99.5 91.4-132.6 12.5-9 37.3-20.8 64-20.8 4.5 0 9 .6 13.5 1.3 0 1.9 0 4.5-.6 7.1-4.5 50.8-36 101.2-88.5 134.3-13.5 8.9-37.3 19.5-62.2 19.5-5.1 0-10.3-.6-18-1.9z"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ── Button content components ── */
function LoadingContent() {
  return (
    <>
      <span className="btn-dots" aria-hidden="true">
        <span className="btn-dot" />
        <span className="btn-dot" />
        <span className="btn-dot" />
      </span>
      Signing in...
    </>
  );
}

function SuccessContent() {
  return (
    <>
      <span className="btn-status-circle btn-status-circle--success" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            className="check-path"
            d="M2 6l3 3 5-5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="btn-state-text">Signed in!</span>
    </>
  );
}

function ErrorContent() {
  return (
    <>
      <span className="btn-status-circle btn-status-circle--error" aria-hidden="true">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <line x1="2" y1="2" x2="8" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="2" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </span>
      <span className="btn-state-text">Invalid credentials</span>
    </>
  );
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const [form,         setForm]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember,     setRemember]     = useState(false);
  const [btnState,     setBtnState]     = useState('idle'); // 'idle'|'loading'|'success'|'error'

  const resetTimer = useRef(null);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(clearAuthState());
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [dispatch]);

  // Google Identity Services: load the script, then render Google's official
  // Sign-In button. Its callback hands us an ID token we send to the backend.
  useEffect(() => {
    async function handleCredential(response) {
      const credential = response?.credential;
      if (!credential) return;
      setBtnState('loading');
      const result = await dispatch(googleLogin(credential));
      const isRealError = googleLogin.rejected.match(result) && !result.payload?.requiresPlanSelection;
      setBtnState(isRealError ? 'error' : 'success');
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setBtnState('idle'), 2200);
    }

    function renderButton() {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential });
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard', theme: 'filled_black', size: 'large',
        text: 'signin_with', shape: 'rectangular', width: 340,
      });
    }

    if (window.google?.accounts?.id) { renderButton(); return; }
    let script = document.getElementById('gis-client');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true; script.defer = true; script.id = 'gis-client';
      document.body.appendChild(script);
    }
    script.addEventListener('load', renderButton);
    return () => script.removeEventListener('load', renderButton);
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthState());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (resetTimer.current) clearTimeout(resetTimer.current);

    setBtnState('loading');
    const result = await dispatch(loginUser({ email: form.email, password: form.password }));
    // requiresPlanSelection isn't a failed login — App.jsx redirects to
    // PlansPage for it, so treat it like success rather than flashing
    // "Invalid credentials" for what was actually a correct login.
    const isRealError = loginUser.rejected.match(result) && !result.payload?.requiresPlanSelection;
    setBtnState(isRealError ? 'error' : 'success');

    resetTimer.current = setTimeout(() => setBtnState('idle'), 2200);
  }

  const isFormValid = form.email.trim() !== '' && form.password.trim() !== '';
  const isIdle = btnState === 'idle';

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
                disabled={!isIdle}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={!isIdle}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="login-remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  className="remember-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  disabled={!isIdle}
                />
                Remember me
              </label>
              <button
                type="button"
                className="forgot-link"
                style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', padding: 0 }}
                onClick={() => { dispatch(resetForgotPassword()); dispatch(showForgotPassword()); }}
                disabled={!isIdle}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={`submit-btn submit-btn--${btnState}`}
              disabled={btnState !== 'idle' || !isFormValid}
            >
              {btnState === 'idle'    && 'Sign In'}
              {btnState === 'loading' && <LoadingContent />}
              {btnState === 'success' && <SuccessContent />}
              {btnState === 'error'   && <ErrorContent />}
            </button>
          </form>

          <div className="divider" style={{ margin: '16px 0 14px' }}><span>Or sign in with</span></div>

          <div className="social-buttons" style={{ flexDirection: 'column', gap: 10 }}>
            <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }} />
            <button
              type="button"
              className="social-btn"
              disabled
              title="Apple Sign-In coming soon"
              style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
            >
              <AppleIcon /> Apple <span style={{ fontSize: 11, opacity: 0.7 }}>(soon)</span>
            </button>
          </div>

          <p className="signin-text" style={{ marginTop: '16px' }}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="inline-link-btn"
              onClick={() => dispatch(showSignup())}
              disabled={!isIdle}
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
