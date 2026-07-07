import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';

const ProfileHeader = ({ user, userName, profileData, setProfileData, handleShare, isOwner = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cine face legea la nume: 1. Setările tale (Display Name) | 2. Username | 3. Numele de pe Spotify
  const finalName = profileData.display_name || profileData.username || userName;
  
  // Tragem poza direct de la Spotify
  const spotifyAvatar = profileData.avatarUrl;

  // Calculăm data de membru
  const joinDate = profileData.created_at 
    ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'July 2026';

  return (
    <section className="profile-hero">
      
      {/* 1. BANNER GENERAT DIN SETĂRI (Color Picker) */}
      <div 
        className="profile-banner"
        style={{
          background: profileData.bg_color 
            ? `linear-gradient(135deg, ${profileData.bg_color}, ${profileData.aura_color || '#000'})` 
            : 'var(--border-hover)'
        }}
      />

      <div className="profile-info-bar">
        <div className="profile-identity">
          
          {/* 2. POZA DE LA SPOTIFY */}
          <div className="avatar-wrapper">
            {spotifyAvatar ? (
              <img src={spotifyAvatar} alt={finalName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar">{finalName.charAt(0).toUpperCase()}</div>
            )}
          </div>

          <div className="profile-meta-text">
            
            {/* 3. NUMELE ALES DIN MODAL */}
            <h1 className="default-name">{finalName}</h1>
            
            <div className="profile-pronouns">
              <span>{profileData.pronouns || 'They/Them'}</span>
              {profileData.location && <span> • {profileData.location}</span>}
              
              {/* 4. MEMBER OF LSTNR */}
              <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', fontStyle: 'italic' }}>
                Member of lstnr since {joinDate}
              </span>
            </div>
            
            <p className="bio-text">
              {profileData.bio || "Add a short bio to tell people about your music taste..."}
            </p>
            
            <div className="profile-links">
              {(profileData.links || []).map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="profile-link-item">
                  {link.title}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={handleShare}>
                Share Profile 📤
              </button>
              {isOwner && (
                <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  Edit Profile ⚙️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal 
          user={user} 
          profileData={profileData} 
          setProfileData={setProfileData} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </section>
  );
};

export default ProfileHeader;