import React from 'react';

export const GridSection = ({ title, subtitle, badgeCount, children }) => (
  <div className="section-card">
    <div className="card-header">
      <div>
        <h2 className="card-title">{title}</h2>
        {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      </div>
      {badgeCount !== undefined ? <span className="card-badge">{badgeCount}</span> : null}
    </div>
    <div className="card-content">
      {children}
    </div>
  </div>
);

export const TrackList = ({ tracks, showTime, emptyMsg }) => {
  if (!tracks || tracks.length === 0) {
    return <div className="empty-state">{emptyMsg}</div>;
  }

  return (
    <div className="list-container">
      {tracks.map((track, idx) => (
        <div key={track.id || idx} className="list-item">
          <span className="item-index">{idx + 1}</span>
          {track.coverUrl && <img src={track.coverUrl} alt="cover" className="item-cover" />}
          <div className="item-details">
            <p className="item-name">{track.title}</p>
            <p className="item-sub">{track.artist}</p>
          </div>
          {showTime && track.playedAt && (
            <span className="item-meta">{new Date(track.playedAt).toLocaleDateString()}</span>
          )}
        </div>
      ))}
    </div>
  );
};