import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, clearPlansError } from '../../store/slices/plansSlice';
import PlanCard from './PlanCard';
import './PlansPage.css';

function BoostIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(37,99,235,0.15)" />
      <path d="M8 16l4-8 4 8" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 13h5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(37,99,235,0.15)" />
      <rect x="8" y="11" width="8" height="6" rx="1.5" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M10 11V8.5a2 2 0 1 1 4 0" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="screen-topbar">
            <div className="screen-bar screen-bar--short" />
            <div className="screen-bar screen-bar--long" />
          </div>
          <div className="screen-chart">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="chart-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 65 C20 60, 30 40, 50 45 S80 20, 100 25 S140 50, 160 35 S185 15, 200 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <path
                d="M0 65 C20 60, 30 40, 50 45 S80 20, 100 25 S140 50, 160 35 S185 15, 200 20 V80 H0Z"
                fill="url(#chartGrad)"
              />
            </svg>
          </div>
          <div className="screen-stats">
            {[40, 70, 55, 90, 60, 80].map((h, i) => (
              <div key={i} className="stat-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.plans);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
    return () => dispatch(clearPlansError());
  }, [dispatch]);

  const TIER_ORDER = ['free', 'gold', 'platinum'];
  const sortedPlans = [...plans].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
  );

  return (
    <div className="plans-page">
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />
      {/* ── Header ── */}
      <header className="plans-header">
        <h1 className="plans-heading">Elevate your digital pulse.</h1>
        <p className="plans-subheading">
          Choose the plan that fits your growth. From casual connecting to professional
          influence, we have a membership designed for your journey.
        </p>
      </header>

      {/* ── Plan cards ── */}
      <section className="plans-grid-section">
        {loading && (
          <div className="plans-loading">
            <span className="spinner spinner--lg" aria-label="Loading plans" />
          </div>
        )}

        {error && !loading && (
          <p className="plans-error" role="alert">{error}</p>
        )}

        {!loading && !error && sortedPlans.length > 0 && (
          <div className="plans-grid">
            {sortedPlans.map((plan, i) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                index={i}
                isSelected={selectedTier === plan.tier}
                onCardClick={() => setSelectedTier(plan.tier)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Why upgrade ── */}
      <section className="why-upgrade">
        <PhoneMockup />

        <div className="why-upgrade-content">
          <h2 className="why-title">Why upgrade your experience?</h2>

          <div className="benefit-list">
            <div className="benefit-item">
              <BoostIcon />
              <div>
                <p className="benefit-title">Boost Visibility</p>
                <p className="benefit-desc">
                  Get seen by up to 4x more people. Our advanced algorithms
                  prioritize your content across the network.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <UnlockIcon />
              <div>
                <p className="benefit-title">Unrestricted Access</p>
                <p className="benefit-desc">
                  Unlock the full suite of creation tools, premium filters, and
                  deep-dive analytics to refine your strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="plans-footer">
        <div className="footer-left">
          <span className="footer-logo">SocialPulse</span>
          <span className="footer-copy">© 2024 SocialPulse Inc. All rights reserved.</span>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
          <a href="#cookies">Cookie Policy</a>
        </nav>
      </footer>
    </div>
  );
}
