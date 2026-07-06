import React, { useEffect, useState } from 'react';
import '../components/Auth/login.css';
import { crossBlack, crossWhite } from '../assets/assets';
import { supabase } from '../supabase';

const initialForm = {
  username: '',
  email: '',
  password: '',
};

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [theme, setTheme] = useState('light');
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: formData.username || formData.email.split('@')[0],
            },
          },
        });

        if (error) {
          setFeedback({ type: 'error', message: error.message });
          return;
        }

        if (data.session) {
          setSuccessTitle('Account created');
          setSuccessMessage('You are signed in successfully.');
          setShowSuccessModal(true);
        } else {
          setFeedback({
            type: 'success',
            message: 'Account created. Please check your inbox to confirm your email.',
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setFeedback({ type: 'error', message: error.message });
          return;
        }

        if (data.user) {
          setSuccessTitle('Welcome back');
          setSuccessMessage('You are signed in successfully.');
          setShowSuccessModal(true);
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSpotify = async (e) => {
  e.preventDefault();
  try {
    setSpotifyLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        // AICI AM ADAUGAT 'playlist-read-private' LA FINAL 👇
        scopes: 'user-read-email user-read-private streaming user-read-currently-playing user-read-playback-state user-top-read user-read-recently-played user-library-read user-follow-read playlist-read-private',
        queryParams: { prompt: 'consent' },
      },
    });

    if (error) {
      setFeedback({ type: 'error', message: error.message });
    }
  } catch (err) {
    setFeedback({ type: 'error', message: 'Spotify sign-in could not be started.' });
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
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Start your journey today.' : 'Continue listening where you left off.'}</p>
        </header>

        <form className="form-container" onSubmit={handleAuth}>
          {isRegister && (
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                className="floating-input"
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
              />
              <label htmlFor="username" className="floating-label">Username</label>
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              className="floating-input"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email" className="floating-label">Email address</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              className="floating-input"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
              minLength="6"
            />
            <label htmlFor="password" className="floating-label">Password</label>
          </div>

          {feedback.message ? (
            <div className={`auth-feedback ${feedback.type}`}>{feedback.message}</div>
          ) : null}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          className="btn-oauth"
          onClick={handleSpotify}
          aria-label="Continue with Spotify"
          disabled={spotifyLoading}
        >
          {spotifyLoading ? <span className="btn-spinner" aria-hidden="true" /> : null}
          Continue with Spotify
        </button>

        <p className="auth-toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setFeedback({ type: '', message: '' });
            }}
            className="auth-toggle-link"
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </p>
      </div>

      {showSuccessModal ? (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
          <div className="auth-modal">
            <div className="auth-modal-icon">✓</div>
            <h2>{successTitle}</h2>
            <p>{successMessage}</p>
            <button type="button" className="auth-modal-button" onClick={() => setShowSuccessModal(false)}>
              Continue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Login;