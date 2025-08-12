import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function SimpleNavbar() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const toggleNav = () => setNavOpen(!navOpen);
  const closeNav = () => setNavOpen(false);

  return (
    <nav className="simple-navbar">
      <div className="simple-navbar-container">
        <Link to="/home" className="simple-logo" onClick={closeNav}>
          BAGHUB
        </Link>

        <button
          className="simple-nav-toggle"
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
          aria-expanded={navOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`simple-nav-links${navOpen ? ' open' : ''}`}>
          <li>
            <Link
              to="/home"
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeNav}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/collections"
              className={location.pathname.startsWith('/shop') ? 'active' : ''}
              onClick={closeNav}
            >
              COLLECTION
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={location.pathname.startsWith('/cart') ? 'active' : ''}
              onClick={closeNav}
            >
              CART
            </Link>
          </li>
          <li>
            <Link
              to="/account"
              className={location.pathname.startsWith('/account') ? 'active' : ''}
              onClick={closeNav}
            >
                ACCOUNT
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {navOpen && <div className="simple-backdrop" onClick={closeNav} />}
    </nav>
  );
}
