import { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../../services/api';
import './SiteAnalyticsModal.css';

function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function isoDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const BAR_COLOR = '#3b82f6';

function ViewsBarChart({ points }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 600;
  const height = 220;
  const padding = { top: 16, right: 8, bottom: 28, left: 8 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = Math.max(1, ...points.map(p => p.views));
  const barGap = 2;
  const barW = points.length > 0 ? Math.max(2, plotW / points.length - barGap) : 0;

  if (points.length === 0) {
    return <div className="sam-chart-empty">No view data for this range yet.</div>;
  }

  const hovered = hoverIndex != null ? points[hoverIndex] : null;

  return (
    <div className="sam-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="sam-chart-svg" role="img" aria-label="Views by date">
        {/* recessive baseline */}
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#1a2540" strokeWidth="1" />
        {points.map((p, i) => {
          const barH = (p.views / max) * plotH;
          const x = padding.left + i * (barW + barGap);
          const y = height - padding.bottom - barH;
          return (
            <rect
              key={p.date}
              x={x}
              y={y}
              width={barW}
              height={Math.max(barH, 1)}
              rx={Math.min(4, barW / 2)}
              fill={BAR_COLOR}
              opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.45}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          );
        })}
      </svg>
      <div className="sam-chart-axis-labels">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
      {hovered && (
        <div className="sam-chart-tooltip">
          <strong>{hovered.views.toLocaleString()}</strong> views — {hovered.date}
        </div>
      )}
    </div>
  );
}

export default function SiteAnalyticsModal({ site, authToken, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const range = useMemo(() => ({ from: isoDateDaysAgo(30), to: isoDateDaysAgo(0) }), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ from: range.from, to: range.to });
        const res = await apiRequest(`/api/mini-sites/${site.id}/analytics?${params}`, { token: authToken });
        if (!cancelled) setData(res?.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [site.id, authToken, range.from, range.to]);

  return (
    <div className="sam-overlay" onClick={onClose}>
      <div className="sam-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sam-header">
          <div>
            <h2 className="sam-title">Analytics — {site.name}</h2>
            <p className="sam-subtitle">Last 30 days ({range.from} → {range.to})</p>
          </div>
          <button className="sam-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

        {loading && <div className="sam-state">Loading analytics…</div>}
        {!loading && error && <div className="sam-state sam-state--error">{error}</div>}

        {!loading && !error && data && (
          <>
            <div className="sam-stats">
              <div className="sam-stat-card">
                <p className="sam-stat-value">{(data.totalViews ?? 0).toLocaleString()}</p>
                <p className="sam-stat-label">TOTAL VIEWS</p>
              </div>
              <div className="sam-stat-card">
                <p className="sam-stat-value">{(data.uniqueVisitors ?? 0).toLocaleString()}</p>
                <p className="sam-stat-label">UNIQUE VISITORS</p>
              </div>
            </div>
            <ViewsBarChart points={data.viewsByDate || []} />
          </>
        )}
      </div>
    </div>
  );
}
