import heroImg from '../../assets/hero.png';

const AVATARS = [
  { id: 1, className: 'avatar-a', initials: 'JD' },
  { id: 2, className: 'avatar-b', initials: 'KM' },
  { id: 3, className: 'avatar-c', initials: 'RS' },
];

export default function HeroPanel() {
  return (
    <div className="signup-hero-panel" aria-hidden="true">
      <img src={heroImg} alt="" className="hero-bg-image" />
      <div className="hero-overlay" />

      <div className="hero-content">
        <blockquote className="hero-quote">
          &ldquo;Connecting millions,<br />one pulse at a time.&rdquo;
        </blockquote>
        <p className="hero-tagline">— Join the global network of thinkers and creators.</p>

        <div className="social-proof">
          <div className="avatars">
            {AVATARS.map(avatar => (
              <div key={avatar.id} className={`avatar ${avatar.className}`}>
                <span className="avatar-initials">{avatar.initials}</span>
              </div>
            ))}
          </div>
          <div className="social-proof-text">
            <span className="social-proof-count">12k+ people</span>
            <span className="social-proof-label">joined the conversation today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
