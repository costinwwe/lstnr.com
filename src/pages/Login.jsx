import React, { useEffect, useState } from 'react';
import '../components/Auth/login.css';
import { crossBlack, crossWhite } from '../assets/assets';
import { supabase } from '../supabase';

const Login = () => {
  const [theme, setTheme] = useState('light');
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ascultăm schimbările de temă pentru logo
  useEffect(() => {
    const initialTheme = document.documentElement.dataset.theme || 'light';
    setTheme(initialTheme);

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || 'light');
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
      setErrorMsg('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: 'user-read-email user-read-private streaming user-read-currently-playing user-read-playback-state user-top-read user-read-recently-played user-library-read user-follow-read playlist-read-private',
          queryParams: { prompt: 'consent' },
          redirectTo: window.location.origin
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err) {
      setErrorMsg('Spotify sign-in could not be started.');
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
            className="auth-logo"
          />
          <h1>Welcome to lstnr</h1>
          <p>Connect with Spotify to access your profile.</p>
        </header>

        {errorMsg && (
          <div className="auth-feedback error">{errorMsg}</div>
        )}

        <button
          className="btn-oauth"
          onClick={handleSpotify}
          aria-label="Continue with Spotify"
          disabled={spotifyLoading}
          style={{ marginTop: '16px' }}
        >
          {spotifyLoading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          Continue with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;