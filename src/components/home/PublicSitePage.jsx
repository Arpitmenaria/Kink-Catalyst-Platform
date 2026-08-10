import { useState, useEffect, useRef } from 'react';
import WebsitePreview from './WebsitePreview';
import { apiRequest } from '../../services/api';
import { normalizeSite } from './miniSiteUtils';
import './PublicSitePage.css';

function siteTokenKey(slug) {
  return `site-token-${slug}`;
}

export default function PublicSitePage({ slug }) {
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | forbidden | needs-password | error
  const [site, setSite] = useState(null);
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const viewTracked = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      const savedToken = localStorage.getItem(siteTokenKey(slug));
      try {
        const res = await apiRequest(
          `/api/mini-sites/public/${encodeURIComponent(slug)}`,
          savedToken ? { token: savedToken } : {}
        );
        if (cancelled) return;
        setSite(normalizeSite(res?.data));
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        if (err.status === 404) setStatus('notfound');
        else if (err.status === 403) setStatus('forbidden');
        else setStatus('needs-password'); // most likely a password-protected site
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  // Record the page view once the site actually renders.
  useEffect(() => {
    if (status !== 'ready' || viewTracked.current) return;
    viewTracked.current = true;
    const referrer = document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch { return ''; } })() : '';
    apiRequest(`/api/mini-sites/public/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      body: { referrer },
    }).catch(() => {});
  }, [status, slug]);

  async function handleVerifyPassword(e) {
    e.preventDefault();
    setVerifying(true);
    setPasswordError('');
    try {
      const res = await apiRequest(`/api/mini-sites/public/${encodeURIComponent(slug)}/verify-password`, {
        method: 'POST',
        body: { password },
      });
      if (res?.token) localStorage.setItem(siteTokenKey(slug), res.token);
      setSite(normalizeSite(res?.data));
      setStatus('ready');
    } catch (err) {
      setPasswordError(err.message || 'Invalid password');
    } finally {
      setVerifying(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="pub-site-state">
        <div className="pub-site-spinner" />
        <p>Loading site…</p>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="pub-site-state">
        <span className="pub-site-state-icon">🔍</span>
        <h1>Site not found</h1>
        <p>This mini site doesn't exist or may have been removed.</p>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="pub-site-state">
        <span className="pub-site-state-icon">🔒</span>
        <h1>This site is private</h1>
        <p>The owner has restricted access to this site.</p>
      </div>
    );
  }

  if (status === 'needs-password') {
    return (
      <div className="pub-site-state">
        <form className="pub-site-password-card" onSubmit={handleVerifyPassword}>
          <span className="pub-site-state-icon">🔐</span>
          <h1>Password Protected</h1>
          <p>Enter the password to view this site.</p>
          <input
            type="password"
            className="pub-site-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {passwordError && <p className="pub-site-password-error">{passwordError}</p>}
          <button type="submit" className="pub-site-password-submit" disabled={verifying || !password}>
            {verifying ? 'Checking…' : 'View Site'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pub-site-page">
      <WebsitePreview sections={site?.sections || []} device="desktop" interactive={false} />
      <div className="pub-site-footer">Made with Kick Analyst Mini Sites</div>
    </div>
  );
}
