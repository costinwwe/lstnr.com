import React, { useState, useEffect, useRef } from 'react';
import './About.css';

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

const About = () => {
  const team = [
    {
      name: 'Alex Chen',
      role: 'Co-founder & CEO',
      bio: 'Music enthusiast and full-stack developer',
      image: '👨‍💼'
    },
    {
      name: 'Jordan Smith',
      role: 'Co-founder & Design Lead',
      bio: 'Product designer passionate about UX',
      image: '👩‍💼'
    },
    {
      name: 'Sam Rodriguez',
      role: 'Head of Community',
      bio: 'Building connections through music',
      image: '👨‍💻'
    },
    {
      name: 'Casey Lee',
      role: 'Backend Engineer',
      bio: 'Making the infrastructure rock-solid',
      image: '👩‍💻'
    }
  ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="layout-grid">
          <FadeIn>
            <div className="about-header">
              <span className="eyebrow">Our Story</span>
              <h1 className="hero-title">Music is Better When It's Shared.</h1>
              <p className="hero-description">
                Resonance was founded on the belief that music discovery is more meaningful when it's personal. We're building a platform that celebrates your musical identity and helps you connect with people who share your taste.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mission-section">
        <div className="layout-grid mission-grid">
          <FadeIn delay={100}>
            <div className="mission-card">
              <div className="mission-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M7 7h10v10H7z"></path></svg>
              </div>
              <h3>Our Mission</h3>
              <p>
                To create a digital space where music lovers can authentically express their identity and discover genuine connections through shared musical experiences.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mission-card">
              <div className="mission-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6v6l4 2"></path></svg>
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the global community where music taste becomes a bridge between people, transforming how artists connect with fans and listeners discover their next favorite song.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mission-card">
              <div className="mission-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Our Values</h3>
              <p>
                Authenticity, community, and inclusivity. We believe everyone's taste in music is valid and worthy of celebration, regardless of genre or popularity.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="team-section">
        <div className="layout-grid">
          <FadeIn>
            <div className="section-header">
              <h2 className="section-title">Meet the Team</h2>
              <p className="section-subtitle">Passionate individuals on a mission to change how music connects people.</p>
            </div>
          </FadeIn>

          <div className="team-grid">
            {team.map((member, index) => (
              <FadeIn key={member.name} delay={100 + index * 100}>
                <div className="team-card">
                  <div className="team-avatar">{member.image}</div>
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="layout-grid">
          <FadeIn>
            <div className="values-content">
              <h2 className="section-title">Why We're Different</h2>
              <div className="values-list">
                <div className="value-item">
                  <div className="value-number">01</div>
                  <div>
                    <h4>Real Connections</h4>
                    <p>No algorithms deciding what you should like. Just genuine people connecting through authentic music taste.</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-number">02</div>
                  <div>
                    <h4>Always Current</h4>
                    <p>Your profile updates in real-time with what you're listening to, capturing your evolving taste.</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-number">03</div>
                  <div>
                    <h4>Community First</h4>
                    <p>Built with feedback from our community. We listen, we learn, and we grow together.</p>
                  </div>
                </div>
              </div>
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
                <a href="/#">Features</a>
                <a href="/#">Integrations</a>
                <a href="/#">Pricing</a>
              </div>
              <div className="link-column">
                <h4>Company</h4>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/#">Blog</a>
              </div>
              <div className="link-column">
                <h4>Legal</h4>
                <a href="/#">Privacy Policy</a>
                <a href="/#">Terms of Service</a>
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

export default About;