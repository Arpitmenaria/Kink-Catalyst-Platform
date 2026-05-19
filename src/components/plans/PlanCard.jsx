import { useDispatch, useSelector } from 'react-redux';
import { selectPlan } from '../../store/slices/plansSlice';

const TIER_META = {
  free: {
    label: 'STARTER',
    name: 'Free Tier',
    button: 'Join for Free',
    popular: false,
    variant: 'outline',
  },
  gold: {
    label: 'INFLUENCER',
    name: 'Gold Tier',
    button: 'Get Gold',
    popular: true,
    variant: 'primary',
  },
  platinum: {
    label: 'PROFESSIONAL',
    name: 'Platinum Tier',
    button: 'Go Platinum',
    popular: false,
    variant: 'outline',
  },
};

function CheckIcon() {
  return (
    <svg className="check-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="rgba(37,99,235,0.15)" />
      <path
        d="M5.5 9l2.5 2.5 4.5-4.5"
        stroke="#3b82f6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return <span className="btn-spinner" aria-hidden="true" />;
}

export default function PlanCard({ plan }) {
  const dispatch = useDispatch();
  const { selecting } = useSelector((state) => state.plans);

  const meta = TIER_META[plan.tier] ?? {
    label: plan.tier.toUpperCase(),
    name: `${plan.tier} Tier`,
    button: 'Select Plan',
    popular: false,
    variant: 'outline',
  };

  const featureList = plan.features.flatMap((f) => f.split('\n')).filter(Boolean);
  const isSelecting = selecting === plan._id;
  const isDisabled = !!selecting;

  function handleSelect() {
    dispatch(selectPlan(plan._id));
  }

  return (
    <div className={`plan-card plan-card--${plan.tier}${meta.popular ? ' plan-card--popular' : ''}`}>
      {meta.popular && (
        <div className="popular-badge">Most Popular</div>
      )}

      <p className="plan-label">{meta.label}</p>
      <h3 className="plan-name">{meta.name}</h3>

      <div className="plan-price">
        <span className="price-dollar">$</span>
        <span className="price-amount">{plan.price}</span>
        <span className="price-period">/mo</span>
      </div>

      <ul className="plan-features">
        {featureList.map((feature, i) => (
          <li key={i} className="plan-feature-item">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`plan-btn plan-btn--${meta.variant}`}
        onClick={handleSelect}
        disabled={isDisabled}
      >
        {isSelecting ? <><Spinner /> Selecting…</> : meta.button}
      </button>
    </div>
  );
}
