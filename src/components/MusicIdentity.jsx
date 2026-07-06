import React from 'react';

// 1. Componenta pentru Genuri Muzicale Preferate
export const FavouriteGenres = ({ genres }) => {
  if (!genres || genres.length === 0) {
    return <div className="empty-state" style={{ padding: '24px' }}>No favourite genres yet.</div>;
  }

  return (
    <div className="chips-container">
      {genres.map((genre, idx) => (
        <span key={idx} className="chip">
          {genre}
        </span>
      ))}
    </div>
  );
};

// 2. Componenta pentru Personalitatea Muzicală (ex: Night Owl, Pioneer)
export const MusicPersonality = ({ personality }) => {
  if (!personality) return null;

  return (
    <div className="chips-container" style={{ marginBottom: '24px' }}>
      <span className="chip" style={{ 
        background: 'var(--text-primary)', 
        color: 'var(--bg-main)', 
        fontWeight: 600,
        borderColor: 'var(--text-primary)' 
      }}>
        {personality}
      </span>
    </div>
  );
};

// 3. Componenta pentru Badge-uri (Achievemnts)
export const AchievementBadges = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return <div className="empty-state" style={{ padding: '24px' }}>No achievements unlocked yet.</div>;
  }

  return (
    <div className="badge-grid">
      {badges.map((badge, idx) => (
        <div key={badge.id || idx} className="badge-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-icon" style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
          <span className="badge-name" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{badge.name}</span>
        </div>
      ))}
    </div>
  );
};