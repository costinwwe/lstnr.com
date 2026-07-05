import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="layout-grid">
          <FadeIn>
            <div className="contact-header">
              <span className="eyebrow">Get In Touch</span>
              <h1 className="hero-title">We'd Love to Hear From You.</h1>
              <p className="hero-description">
                Have a question or feedback about Resonance? Drop us a message and we'll get back to you as soon as possible.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="contact-content">
        <div className="layout-grid contact-grid">
          <FadeIn delay={100}>
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <h3>Location</h3>
                <p>San Francisco, CA</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h3>Phone</h3>
                <p>+1 (415) 555-0123</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h3>Email</h3>
                <p>hello@resonance.app</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what's on your mind..."
                    rows="6"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Send Message
                </button>

                {submitted && (
                  <div className="success-message">
                    ✓ Thanks for reaching out! We'll be in touch soon.
                  </div>
                )}
              </form>
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

export default Contact;