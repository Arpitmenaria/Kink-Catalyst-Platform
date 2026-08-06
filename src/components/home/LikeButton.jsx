import { useState } from 'react';
import './LikeButton.css';

function HeartIcon({ filled = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function LikeButton({ isLiked = false, count = 0, onLike, onUnlike, isLoading = false, showCount = true }) {
  const [animate, setAnimate] = useState(false);

  console.log('🎨 LikeButton rendered:', { isLiked, count, showCount });

  function handleClick() {
    if (isLoading) return;

    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    if (isLiked) {
      onUnlike?.();
    } else {
      onLike?.();
    }
  }

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <HeartIcon filled={isLiked} />
      {showCount && count > 0 && <span className="like-count">{count}</span>}
    </button>
  );
}

export default LikeButton;
