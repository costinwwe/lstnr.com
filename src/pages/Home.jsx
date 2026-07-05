import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in fade-in-${direction} ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ value, suffix = '', decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = null;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(value * easeOutQuart);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="counter-value">
      {count.toFixed(decimals)}
      {suffix}
    </div>
  );
};

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="layout-grid hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Share Your Music</span>

            <FadeIn delay={100}>
              <h1 className="hero-title">
                Your Music.
                <br />
                Your <span className="text-accent">Identity.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="hero-description">
                Create a music profile that automatically updates with what you're listening to. Share it with friends and discover new music through real connections.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="hero-actions">
                <button className="btn btn-primary">Get Started</button>
                <button className="btn btn-secondary">View Demo</button>
              </div>

              <div className="social-proof">
                <div className="stars">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </div>
                <span className="social-proof-text">10,000+ music lovers already sharing.</span>
              </div>
            </FadeIn>
          </div>

          <div className="hero-visual">
            <FadeIn delay={200} direction="left">
              <div className="hero-image-placeholder">
                <div className="placeholder-overlay"></div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="layout-grid">
          <div className="features-header">
            <FadeIn>
              <h2 className="section-title">Everything you need to showcase your taste.</h2>
              <p className="section-subtitle">A unified platform designed for music enthusiasts to connect, share, and discover organically.</p>
            </FadeIn>
          </div>

          <div className="features-grid">
            <FadeIn delay={100}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </div>
                <h3>Share Your Profile</h3>
                <p>Generate a beautifully designed public page that represents your unique musical identity to the world.</p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                </div>
                <h3>Live Listening</h3>
                <p>Sync your Spotify or Apple Music to show visitors exactly what's playing in your headphones right now.</p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3>Find Your People</h3>
                <p>Discover users with similar listening habits and build communities around shared favorite artists and genres.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="layout-grid preview-grid">
          <div className="preview-content">
            <FadeIn>
              <h2 className="section-title">Your digital music passport.</h2>
              <p className="section-subtitle">
                More than just a link in bio. Your profile is a living, breathing representation of your current obsessions, all-time favorites, and listening habits.
              </p>
              <ul className="preview-features-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Real-time status updates
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Detailed listening statistics
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Customizable aesthetic
                </li>
              </ul>
            </FadeIn>
          </div>

          <div className="preview-visual">
            <FadeIn delay={200} direction="up">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar-placeholder"></div>
                  <div className="profile-user-info">
                    <h4>Alex Carter</h4>
                    <span>@alexlistens</span>
                  </div>
                  <button className="btn-follow">Follow</button>
                </div>

                <div className="now-playing-module">
                  <div className="module-header">
                    <span className="pulsing-dot"></span> Now Playing
                  </div>
                  <div className="track-info">
                    <div className="art-placeholder"></div>
                    <div className="track-details">
                      <div className="track-name">Midnight City</div>
                      <div className="track-artist">M83</div>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                    <div className="progress-timestamps">
                      <span>1:42</span>
                      <span>4:03</span>
                    </div>
                  </div>
                </div>

                <div className="profile-stats-grid">
                  <div className="stat-block">
                    <span className="stat-label">Listening Streak</span>
                    <span className="stat-value">14 Days</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-label">Followers</span>
                    <span className="stat-value">1,248</span>
                  </div>
                </div>

                <div className="favorites-module">
                  <div className="module-header">Top Genres</div>
                  <div className="tags-container">
                    <span className="tag">Indie Pop</span>
                    <span className="tag">Synthwave</span>
                    <span className="tag">Alternative</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="layout-grid">
          <div className="stats-grid">
            <div className="stat-item">
              <AnimatedCounter value={50} suffix="K+" duration={2000} />
              <p>Profiles Created</p>
            </div>
            <div className="stat-item">
              <AnimatedCounter value={2} suffix="M+" duration={2000} />
              <p>Songs Shared</p>
            </div>
            <div className="stat-item">
              <AnimatedCounter value={120} suffix="+" duration={2000} />
              <p>Countries</p>
            </div>
            <div className="stat-item">
              <AnimatedCounter value={99.9} suffix="%" decimals={1} duration={2000} />
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="layout-grid">
          <FadeIn>
            <div className="cta-container">
              <div className="cta-background-glow"></div>
              <h2>Ready to share your music?</h2>
              <p>Join thousands of listeners building their digital music identity today.</p>
              <button className="btn btn-primary btn-large">Create Your Profile</button>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="footer">
        <div className="layout-grid">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                <span>Resonance</span>
              </div>
              <p>Your music. Your identity.</p>
            </div>

            <div className="footer-links">
              <div className="link-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Integrations</a>
                <a href="#">Pricing</a>
                <a href="#">Changelog</a>
              </div>
              <div className="link-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
              </div>
              <div className="link-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Resonance Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
