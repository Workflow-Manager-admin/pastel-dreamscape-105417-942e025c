import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Music from './pages/Music';
import Shop from './pages/Shop';
import Navbar from './components/Navbar';

/**
 * PUBLIC_INTERFACE
 * Main app layout with dreamy glassmorphic floating top Navbar and pastel background.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App dreamy-app-bg dreamy-shimmer-bg">
      {/* Soft dream background sparkles */}
      <div className="dreamy-sparkle-layer" aria-hidden="true" style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none"
      }}>
        {[...Array(9)].map((_, i) => (
          <span
            key={i}
            className="dreamy-sparkle"
            style={{
              left: `${12 + (i * 13 + i * 49) % 78}%`,
              top: `${(6 + (i * 33 + i * 13) % 91)}%`,
              width: 14 + (i % 2) * 7 + (i % 3) * 3,
              height: 14 + (i % 2) * 7 + (i % 3) * 3,
              filter: `blur(${0.7 + (i % 2 ? 1.1 : 0.2)}px) brightness(1.${2 + i % 5})`,
              opacity: 0.7 + 0.19 * (i % 3),
              background: i % 3 === 2
                ? "radial-gradient(circle,#ffabd244 70%,#ffeaf4bb 100%)"
                : i % 2
                ? "radial-gradient(circle,#caaaff77 80%,#ffeaf4bb 100%)"
                : "radial-gradient(circle,#fff1 60%,#caaaff33 100%)",
              animationDelay: `${0.22 * i}s`
            }} />
        ))}
      </div>

      {/* Top-floating dreamy glassy Navbar */}
      <Navbar />

      {/* Theme toggle floats upper-right, always visible */}
      <button
        className="theme-toggle dreamy-shimmer"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{
          position: "fixed",
          right: 22,
          top: 18,
          zIndex: 1200,
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <div className="main-content" style={{ paddingTop: 92 }}>
        <main style={{ flex: 1, minHeight: '100vh' }} role="main">
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
    </div>
  );
}

export default App;
