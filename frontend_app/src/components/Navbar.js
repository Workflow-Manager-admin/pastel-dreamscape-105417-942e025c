import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Floating, pastel glassmorphic navigation bar for Softcore Galaxy app.
 * Contains navigation links, glass blur, sparkly animated stars, and dreamy pastel outline.
 * Accessibility: Uses role="navigation", ARIA labels, keyboard navigation/tab order, visible focus. 
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
  // Allow arrow key navigation for top-level links for a11y nerds
  const navRefs = useRef([]);

  const handleKeyDown = (event, idx) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIdx;
    if (event.key === "ArrowRight") {
      nextIdx = (idx + 1) % navItems.length;
    } else if (event.key === "ArrowLeft") {
      nextIdx = (idx - 1 + navItems.length) % navItems.length;
    } else if (event.key === "Home") {
      nextIdx = 0;
    } else if (event.key === "End") {
      nextIdx = navItems.length - 1;
    }
    navRefs.current[nextIdx].focus();
  };

  return (
    <nav 
      className="dreamy-navbar" 
      role="navigation" 
      aria-label="Main Navigation"
    >
      {/* Sparkle layer */}
      <div className="navbar-sparkle-layer" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`navbar-sparkle sparkle-${i % 3}`}></span>
        ))}
      </div>
      {/* Navigation links */}
      <ul className="navbar-links" role="menubar" aria-label="Site sections">
        {navItems.map((item, i) => (
          <li key={item.path} className="navbar-item" role="none">
            <Link
              to={item.path}
              className={`navbar-link${location.pathname === item.path ? " active" : ""}`}
              aria-current={location.pathname === item.path ? "page" : undefined}
              tabIndex={0}
              role="menuitem"
              aria-label={item.label}
              ref={el => navRefs.current[i] = el}
              onKeyDown={e => handleKeyDown(e, i)}
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
