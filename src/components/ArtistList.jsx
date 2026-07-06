import React from 'react';

const ArtistList = ({ artists, emptyMsg }) => {
  if (!artists || artists.length === 0) {
    return <div className="empty-state">{emptyMsg}</div>;
  }

  return (
    <div className="list-container">
      {artists.map((artist, idx) => (
        <div key={artist.id || idx} className="list-item">
          <span className="item-index">{idx + 1}</span>
          <img 
            src={artist.imageUrl} 
            alt={artist.name} 
            className="item-cover circle" 
          />
          <div className="item-details">
            <p className="item-name">{artist.name}</p>
            <p className="item-sub">
              {typeof artist.popularity === 'number'
                ? `${artist.popularity}% popularity`
                : typeof artist.playCount === 'number'
                  ? `${artist.playCount.toLocaleString()} plays`
                  : 'Artist'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtistList;