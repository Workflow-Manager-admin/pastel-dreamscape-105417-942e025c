import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Music from './pages/Music';
import Shop from './pages/Shop';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/room', label: 'My Room' },
  { path: '/journal', label: 'Journal' },
  { path: '/profile', label: 'Profile' },
  { path: '/music', label: 'Music' },
  { path: '/shop', label: 'Shop' },
];

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: "auto", paddingBottom: 0 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <nav className="navbar" style={{ margin: "32px 0 24px 0", display: "flex", gap: 24, justifyContent: "center", alignItems: "center" }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="App-link"
              style={{
                textDecoration: location.pathname === item.path ? "underline" : "none",
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                fontSize: "1.15rem"
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/music" element={<Music />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
