import React from 'react';

const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <button
      className={`hamburger-btn ${isOpen ? 'open' : ''}`}
      onClick={toggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="hamburger-lines" />
    </button>
  );
};

// Memoizing to prevent re-renders when other navbar states change
export default React.memo(HamburgerButton);