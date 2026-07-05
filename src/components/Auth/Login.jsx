import React, { useState } from 'react';
import './login.css';
import { logo } from '../../assets'; // Ensure this exists in your project

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    console.log("Auth triggered");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <img src={logo} alt="Logo" style={{ height: '40px', marginBottom: '20px' }} />
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

        <button className="btn-oauth" onClick={() => console.log('Spotify Auth')}>
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