import React, { useRef, useState } from 'react';
import { supabase } from '../supabase';
import EditProfileModal from './EditProfileModal';

const ProfileHeader = ({ user, userName, profileData, setProfileData, handleShare, isOwner = false, stats = {} }) => {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Starea care controlează popup-ul de editare

  const handleFileUpload = async (event, bucket, updateKey) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    // TODO: Connect to your actual Supabase Storage buckets
    /*
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      setProfileData(prev => ({ ...prev, [updateKey]: data.publicUrl }));
      // TODO: Update user's profile row in database with new URL
    }
    */
  };

  return (
    <section className="profile-hero">
      <div className="profile-banner">
        {profileData.bannerUrl ? (
          <img src={profileData.bannerUrl} alt="Profile Banner" />
        ) : (
          <div className="banner-overlay" />
        )}
        {isOwner ? (
          <label className="edit-overlay">
            <span>Edit Banner</span>
            <input
              type="file"
              className="hidden-input"
              ref={bannerInputRef}
              onChange={(e) => handleFileUpload(e, 'banners', 'bannerUrl')}
              accept="image/*"
            />
          </label>
        ) : null}
      </div>

      <div className="profile-info-bar">
        <div className="profile-identity">
          <div className="avatar-wrapper">
            {profileData.avatarUrl ? (
              <img src={profileData.avatarUrl} alt={userName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar">{userName.charAt(0).toUpperCase()}</div>
            )}
            {isOwner ? (
              <label className="edit-overlay">
                <span style={{ fontSize: '0.8rem' }}>Upload</span>
                <input
                  type="file"
                  className="hidden-input"
                  ref={avatarInputRef}
                  onChange={(e) => handleFileUpload(e, 'avatars', 'avatarUrl')}
                  accept="image/*"
                />
              </label>
            ) : null}
          </div>

          <div className="profile-meta-text">
            {/* Dacă are premium și a ales Crimson, îi punem clasa, dacă nu, default. Plus coroana dacă e premium! */}
            <h1 className={profileData.name_style === 'crimson' ? 'premium-name-crimson' : 'default-name'}>
  {/* Aici am schimbat ordinea: întâi display_name, apoi username */}
  {profileData.display_name || profileData.username || userName}
  {profileData.is_premium && <span title="Premium User" style={{ marginLeft: '8px', fontSize: '1.5rem' }}>👑</span>}
</h1>
             
<div className="profile-pronouns">
  {profileData.pronouns} • {profileData.location && `${profileData.location} • `} 
  <span className="member-since">
    {stats.public_playlists ?? 0} Playlists
  </span>
</div>
            
            <p className="bio-text">
              {profileData.bio || "Add a short bio to tell people about your music taste..."}
            </p>
            
            <div className="profile-links">
              {(profileData.links || []).map((link, idx) => (
                <a
                  key={`${link.title}-${idx}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link-item"
                >
                  {link.title}
                </a>
              ))}
              {isOwner ? <button type="button" className="profile-link-item">+ Add Link</button> : null}
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleShare}>
              Share Profile 📤
            </button>
          </div>
        </div>

        {/* Butonul de editare care deschide modalul */}
        {isOwner ? (
          <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>
            Edit Profile
          </button>
        ) : null}
      </div>

      {/* Randăm Modalul condiționat, exact peste tot */}
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