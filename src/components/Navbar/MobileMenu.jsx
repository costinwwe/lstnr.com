import React, { useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import ThemeToggle from './ThemeToggle';

const MobileMenu = ({ isOpen, close, user }) => {
  const navigate = useNavigate();

  // 1. Premium UX: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // 2. Action Handlers
  const handleLogin = useCallback(() => {
    close();
    navigate('/login');
  }, [close, navigate]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    close();
  }, [close]);

  // Routing config (matches desktop)
  const routes = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Backdrop Overlay - clicks outside the panel close the menu */}
      <div 
        className={`mobile-overlay ${isOpen ? 'open' : ''}`} 
        onClick={close}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <aside className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}>
        
        {/* Navigation Links */}
        <nav className="mobile-nav-links">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              onClick={close}
              className={({ isActive }) => 
                `mobile-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {route.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Theme & Auth */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Mobile Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Appearance
            </span>
            <ThemeToggle />
          </div>
          
          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Mobile User Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <img 
                   src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=random`} 
                   alt="Avatar" 
                   style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-hover)' }}
                 />
                 <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                   Account
                 </span>
               </div>
               <button 
                 onClick={handleLogout}
                 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'transparent', padding: '8px' }}
               >
                 Log out
               </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="btn-login"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center' }}
            >
              Log In
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default React.memo(MobileMenu);