import React, { useState, useEffect } from 'react';
import '../components/Auth/login.css';
import { logo, crossBlack, crossWhite } from '../assets/assets'; // Ensure this exists in your project
import { supabase } from '../supabase';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleAuth = (e) => {
    e.preventDefault();
    console.log("Auth triggered");
  };

  const [spotifyLoading, setSpotifyLoading] = useState(false);

  // Theme Listener
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

  const handleSpotify = async (e) => {
    e.preventDefault();
    try {
      setSpotifyLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: 'user-read-email user-read-private streaming',
          queryParams: { prompt: 'consent' },
        },
      });

      if (error) {
        console.error('Spotify OAuth error', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSpotifyLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <img 
            src={theme === 'dark' ? crossWhite : crossBlack} 
            alt="Logo" 
            style={{ height: '40px', marginBottom: '20px' }} 
          />
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Start your journey today.' : 'Continue listening where you left off.'}</p>
        </header>

        <form className="form-container" onSubmit={handleAuth}>
          {isRegister && (
            <div className="form-group">
              <input type="text" id="username" className="floating-input" placeholder=" " />
              <label htmlFor="username" className="floating-label">Username</label>
            </div>
          )}

          <div className="form-group">
            <input type="email" id="email" className="floating-input" placeholder=" " />
            <label htmlFor="email" className="floating-label">Email address</label>
          </div>

          <div className="form-group">
            <input type="password" id="password" className="floating-input" placeholder=" " />
            <label htmlFor="password" className="floating-label">Password</label>
          </div>

          <button type="submit" className="btn-primary">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          className="btn-oauth"
          onClick={handleSpotify}
          aria-label="Continue with Spotify"
          disabled={spotifyLoading}
        >
          {spotifyLoading ? (
            <span className="btn-spinner" aria-hidden="true" />
          ) : null}
          Continue with Spotify
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: 'var(--primary)', marginLeft: '8px', background: 'none', fontWeight: 600 }}
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;