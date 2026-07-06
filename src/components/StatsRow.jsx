import React from 'react';

const STAT_LABELS = {
  public_playlists: 'Public Playlists',
  following: 'Following',
  followers: 'Followers',
  hours_listened: 'Hours Listened',
};

const StatsRow = ({ stats }) => (
  <div className="stats-row">
    {Object.entries(stats).map(([key, value]) => (
      <div key={key} className="stat-card">
        <span className="stat-value">{Number(value || 0).toLocaleString()}</span>
        <span className="stat-label">{STAT_LABELS[key] || key.replaceAll('_', ' ')}</span>
      </div>
    ))}
  </div>
);

export default StatsRow;