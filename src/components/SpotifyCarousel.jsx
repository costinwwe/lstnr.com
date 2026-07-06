import React from 'react';

const SpotifyCarousel = ({ items, emptyMsg, variant = 'square' }) => {
  if (!items || items.length === 0) {
    return <div className="empty-state">{emptyMsg}</div>;
  }

  return (
    <div className="spotify-carousel">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url || '#'}
          target={item.url ? '_blank' : undefined}
          rel={item.url ? 'noopener noreferrer' : undefined}
          className={`spotify-carousel-item ${variant}`}
          onClick={item.url ? undefined : (e) => e.preventDefault()}
        >
          <div className={`spotify-carousel-media ${variant}`}>
            {item.coverUrl || item.imageUrl ? (
              <img src={item.coverUrl || item.imageUrl} alt={item.title || item.name} />
            ) : (
              <div className="spotify-carousel-fallback">♪</div>
            )}
          </div>
          <div className="spotify-carousel-text">
            <p className="spotify-carousel-title">{item.title || item.name}</p>
            <p className="spotify-carousel-subtitle">{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SpotifyCarousel;
