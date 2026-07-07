import React from 'react';

const MiniPlayer = ({ currentlyPlaying }) => {
  if (!currentlyPlaying) {
    return (
      <div className="mini-player-card" style={{ justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Nothing is currently playing.</span>
      </div>
    );
  }

  const progressPercent = (currentlyPlaying.progress / currentlyPlaying.duration) * 100;

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="mini-player-card">
      <div className="player-info">
        <img src={currentlyPlaying.coverUrl} alt="Album Art" className="player-cover" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentlyPlaying.title}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentlyPlaying.artist}
          </div>
        </div>
      </div>

      <div className="player-progress">
        <span className="time-text">{formatTime(currentlyPlaying.progress)}</span>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }} />
        </div>
        <span className="time-text">{formatTime(currentlyPlaying.duration)}</span>
      </div>
    </div>
  );
};

export default MiniPlayer;