import React, { useState } from 'react';
import { supabase } from '../supabase';

const ProfileLinks = ({ userId, initialLinks = [] }) => {
  const [links, setLinks] = useState(initialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [newLink, setNewLink] = useState({ title: 'Spotify', url: '' });

  // Map titles to emojis/icons for a clean look
  const getIcon = (title) => {
    const icons = {
      Website: '🌐', GitHub: '💻', Discord: '🎮', Spotify: '🎧', 
      YouTube: '▶️', Instagram: '📸', Twitter: '🐦', TikTok: '🎵'
    };
    return icons[title] || '🔗';
  };

  const handleAddLink = async () => {
    if (!newLink.url) return;
    
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    setNewLink({ title: 'Spotify', url: '' });
    setIsEditing(false);

    // TODO: Connect to your actual Supabase profile table
    // await supabase.from('profiles').update({ profile_links: updatedLinks }).eq('id', userId);
  };

  const handleRemoveLink = async (indexToRemove) => {
    const updatedLinks = links.filter((_, idx) => idx !== indexToRemove);
    setLinks(updatedLinks);

    // TODO: Connect to your actual Supabase profile table
    // await supabase.from('profiles').update({ profile_links: updatedLinks }).eq('id', userId);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div className="profile-links">
        {links.length === 0 && !isEditing && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No profile links added.</span>
        )}

        {links.map((link, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" /* CRITICAL: Opens safely */
              className="profile-link-item"
            >
              <span>{getIcon(link.title)}</span> {link.title}
            </a>
            {isEditing && (
              <button 
                onClick={() => handleRemoveLink(idx)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button 
          className="profile-link-item" 
          onClick={() => setIsEditing(!isEditing)}
          style={{ background: isEditing ? 'var(--bg-hover)' : 'transparent', borderStyle: 'dashed' }}
        >
          {isEditing ? 'Done' : '+ Edit Links'}
        </button>
      </div>

      {isEditing && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
          <select 
            value={newLink.title} 
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
          >
            {['Website', 'GitHub', 'Discord', 'Spotify', 'YouTube', 'Instagram', 'Twitter', 'TikTok'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input 
            type="url" 
            placeholder="https://" 
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            style={{ flex: 1, padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
          />
          <button className="btn btn-secondary" style={{ padding: '6px 16px' }} onClick={handleAddLink}>Add</button>
        </div>
      )}
    </div>
  );
};

export default ProfileLinks;