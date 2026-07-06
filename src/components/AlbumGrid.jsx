import React from 'react';

const AlbumGrid = ({ albums, emptyMsg }) => {
  if (!albums || albums.length === 0) {
    return <div className="empty-state">{emptyMsg}</div>;
  }

  return (
    <div className="badge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
      {albums.map((album, idx) => (
        <div 
          key={album.id || idx} 
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
        >
          <img 
            src={album.coverUrl} 
            alt={album.title} 
            style={{ 
              width: '100%', 
              aspectRatio: '1', 
              borderRadius: 'var(--radius-md)', 
              objectFit: 'cover',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)'
            }} 
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {album.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {album.artist}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;