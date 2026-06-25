import { useState, useEffect } from 'react';

export default function SkeletonImg({ src, alt = '', className, imgStyle, skeletonStyle, fallback }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    if (!src) { setStatus('error'); return; }

    setStatus('loading');

    // Use a programmatic Image to track load — avoids missing onLoad
    // for browser-cached images that fire before React attaches handlers
    const img = new window.Image();
    let cancelled = false;

    img.onload  = () => { if (!cancelled) setStatus('loaded'); };
    img.onerror = () => { if (!cancelled) setStatus('error');  };
    img.src = src;

    // Already in browser cache — .complete is true synchronously
    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
    }

    return () => { cancelled = true; };
  }, [src]);

  return (
    <>
      {status === 'loading' && (
        <div
          className="img-skeleton"
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 1, ...skeletonStyle }}
        />
      )}

      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={`${className ?? ''} ${status === 'loaded' ? 'img-reveal' : ''}`.trim()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: status === 'loaded' ? 1 : 0,
            ...imgStyle,
          }}
        />
      )}

      {status === 'error' && (fallback ?? null)}
    </>
  );
}
