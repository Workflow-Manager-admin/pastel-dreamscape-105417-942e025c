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
 * Main app layout with dreamy glassmorphic Navbar and pastel background.
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
    <div className="App dreamy-app-bg">
      {/* Floating glassy navbar (fixed at top) */}
      <Navbar />
      {/* Theme toggle floats above navbar */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{
          position: "fixed",
          right: 22,
          top: 18,
          zIndex: 12,
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <main style={{ flex: 1, marginTop: 100 }}>
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
