import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Floating, pastel glassmorphic navigation bar for Softcore Galaxy app.
 * Contains navigation links, glass blur, sparkly animated stars, and dreamy pastel outline.
 */
const navItems = [
  { path: "/", label: "Home" },
  { path: "/room", label: "My Room" },
  { path: "/journal", label: "Journal" },
  { path: "/profile", label: "Profile" },
  { path: "/music", label: "Music" },
  { path: "/shop", label: "Shop" }
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="dreamy-navbar">
      {/* Sparkle layer */}
      <div className="navbar-sparkle-layer" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`navbar-sparkle sparkle-${i % 3}`}></span>
        ))}
      </div>
      {/* Navigation links */}
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item.path} className="navbar-item">
            <Link
              to={item.path}
              className={`navbar-link${
                location.pathname === item.path ? " active" : ""
              }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
