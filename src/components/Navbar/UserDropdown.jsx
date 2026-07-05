import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button 
        className="user-avatar-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <img 
          src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} 
          alt="User Avatar" 
        />
      </button>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <button className="dropdown-item" onClick={() => { navigate('/profile'); setIsOpen(false); }}>
          Profile
        </button>
        <button className="dropdown-item" onClick={() => { navigate('/settings'); setIsOpen(false); }}>
          Settings
        </button>
        <div className="dropdown-divider" />
        <button className="dropdown-item" onClick={handleLogout} style={{ color: '#ff4444' }}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default React.memo(UserDropdown);