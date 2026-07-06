import React, { useRef } from 'react';
import { supabase } from '../supabase';

const ProfileHeader = ({ user, userName, profileData, setProfileData, handleShare, isOwner = false, stats = {} }) => {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

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
            <h1>{userName}</h1>
            <div className="profile-pronouns">
              {profileData.pronouns}
              {' • '}
              <span className="member-since">
                {stats.public_playlists ?? 0} Public Playlists • {stats.following ?? 0} Following
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

        {isOwner ? <button type="button" className="btn btn-secondary">Edit Profile</button> : null}
      </div>
    </section>
  );
};

export default ProfileHeader;