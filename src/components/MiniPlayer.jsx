import React, { useEffect, useState } from 'react';

const MiniPlayer = ({ spotifyAccessToken }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    // Nu facem fetch dacă nu avem token
    if (!spotifyAccessToken) return;

    const fetchCurrentlyPlaying = async () => {
      try {
        // Fix 1: Folosim endpoint-ul oficial Spotify
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
  headers: {
    Authorization: `Bearer ${spotifyAccessToken}`,
    'Content-Type': 'application/json'
  }
});

        // Spotify dă 204 dacă utilizatorul nu ascultă nimic momentan
        if (response.status === 204 || response.status > 400) {
          setCurrent(null);
          return;
        }

        const data = await response.json();
        
        if (data.is_playing && data.item) {
          setCurrent({
            title: data.item.name,
            artist: data.item.artists.map(a => a.name).join(', '),
            album: data.item.album.name,
            coverUrl: data.item.album.images[0]?.url,
            progress: data.progress_ms,
            duration: data.item.duration_ms,
          });
        } else {
          setCurrent(null);
        }
      } catch (error) {
        console.error("Eroare la fetch-ul datelor de pe Spotify:", error);
      }
    };

    // Apelăm funcția o dată imediat cum se montează componenta
    fetchCurrentlyPlaying();

    // Fix 2: Polling la fiecare 5 secunde (5000 ms) pentru real-time update
    const intervalId = setInterval(fetchCurrentlyPlaying, 5000);

    // Curățăm intervalul la unmount ca să nu avem memory leaks
    return () => clearInterval(intervalId);
  }, [spotifyAccessToken]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!current) {
    return (
      <div className="mini-player-card" style={{ justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Nothing is currently playing.</span>
      </div>
    );
  }

  // Calculăm procentajul pentru progress bar
  const progressPercent = (current.progress / current.duration) * 100;

  return (
    <div className="mini-player-card">
      <div className="player-info">
        <img src={current.coverUrl} alt="Album Art" className="player-cover" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{current.title}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {current.artist} • {current.album}
          </div>
        </div>
      </div>

      <div className="player-progress">
        <span className="time-text">{formatTime(current.progress)}</span>
        <div className="progress-bar-bg">
          {/* Tranziția CSS liniară ajută bara să se miște clean între intervale */}
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${progressPercent}%`, 
              transition: 'width 1s linear' 
            }} 
          />
        </div>
        <span className="time-text">{formatTime(current.duration)}</span>
      </div>
    </div>
  );
};

export default MiniPlayer;