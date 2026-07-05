import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { logo ,crossBlack, crossWhite} from '../../assets/assets'; // Using your existing logo

// Sub-components
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import HamburgerButton from './HamburgerButton';
import MobileMenu from './MobileMenu';

// Styles
import './navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  
  const navigate = useNavigate();

  // 1. Independent Auth Listener
  useEffect(() => {
    // Fetch initial session
    const initializeSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        setUser(session.user);
      }
    };
    
    initializeSession();

    // Subscribe to auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 1.5 Theme Listener
  useEffect(() => {
    // Set initial theme
    const initialTheme = document.documentElement.dataset.theme || 'light';
    setTheme(initialTheme);

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.dataset.theme || 'light';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // 2. Scroll Listener for Premium Shadow Effect
  useEffect(() => {
    const handleScroll = () => {
      // Toggle shadow when scrolled down more than 10px
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Mobile Menu Body Scroll Lock
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // 4. Memoized Callbacks for Performance
  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <>
      <header 
        className="navbar-wrapper"
        style={{
          // Apply dynamic shadow based on scroll position
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
          borderColor: isScrolled ? 'var(--border)' : 'transparent'
        }}
      >
        <div className="navbar-container">
          
          {/* LEFT: Brand / Logo */}
          <div className="navbar-left">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              <img 
                src={theme === 'dark' ? crossWhite : crossBlack} 
                alt="lstnr" 
                className="navbar-logo-img"
              />
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="navbar-center">
            <NavLinks />
          </nav>

          {/* RIGHT: Actions, Theme, Auth */}
          <div className="navbar-right">
            <div className="desktop-only">
              <ThemeToggle />
            </div>
            
            {user ? (
              <div className="desktop-only">
                <UserDropdown user={user} />
              </div>
            ) : (
              <button 
                onClick={handleLoginClick} 
                className="btn-login desktop-only"
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <HamburgerButton 
              isOpen={isMobileOpen} 
              toggle={toggleMobileMenu} 
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Portal overlay */}
      <MobileMenu 
        isOpen={isMobileOpen} 
        close={closeMobileMenu} 
        user={user} 
      />
    </>
  );
};

export default React.memo(Navbar);