import React, { useState } from 'react';
import { supabase } from '../supabase';

const EditProfileModal = ({ user, profileData, setProfileData, onClose }) => {
  const [formData, setFormData] = useState({
    username: profileData.username || '',
    display_name: profileData.display_name || '',
    bio: profileData.bio || '',
    pronouns: profileData.pronouns || 'They/Them',
    location: profileData.location || '',
    bg_color: profileData.bg_color || '#121212',
    aura_color: profileData.aura_color || '#1DB954',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Upsert agresiv ca să forțăm salvarea
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          pronouns: formData.pronouns,
          location: formData.location,
          bg_color: formData.bg_color,
          aura_color: formData.aura_color,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();

      if (error) throw new Error(error.message);
      
      // Update instant pe ecran
      setProfileData(prev => ({ ...prev, ...formData }));
      onClose();
    } catch (err) {
      alert("Nu s-a putut salva: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-modal" onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 16px 0' }}>Profile Settings</h2>
        <div className="modal-scroll-area" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          
          <div className="form-group">
            <label>@Username (Link)</label>
            <input className="form-input" type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Display Name (Numele Afișat)</label>
            <input className="form-input" type="text" name="display_name" value={formData.display_name} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label>Pronouns</label>
              <select className="form-select" name="pronouns" value={formData.pronouns} onChange={handleChange} style={{ width: '100%' }}>
                <option value="They/Them">They/Them</option>
                <option value="He/Him">He/Him</option>
                <option value="She/Her">She/Her</option>
                <option value="Any">Any Pronouns</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Location</label>
              <input className="form-input" type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea className="form-input" name="bio" value={formData.bio} onChange={handleChange} rows="2" />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label>Background</label>
              <input type="color" name="bg_color" value={formData.bg_color} onChange={handleChange} style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label>Aura Color</label>
              <input type="color" name="aura_color" value={formData.aura_color} onChange={handleChange} style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ background: 'var(--text-primary)', color: 'var(--bg-main)' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfileModal;