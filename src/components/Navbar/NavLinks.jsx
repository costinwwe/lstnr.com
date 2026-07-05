import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ onClick }) => {
  // Centralized navigation configuration
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          onClick={onClick}
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          {route.name}
        </NavLink>
      ))}
    </>
  );
};

// Memoizing prevents NavLinks from re-rendering when the parent 
// Navbar handles scroll events or auth changes.
export default React.memo(NavLinks);