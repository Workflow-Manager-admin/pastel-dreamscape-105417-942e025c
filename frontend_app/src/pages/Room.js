import React, { useState, useEffect, useRef } from 'react';
import { usePersistedState } from '../utils/storage';
import GlassyCard from '../components/GlassyCard';
import DecorItem from '../components/RoomComponents/DecorItem';

// Room configuration constants
const DECOR_CATEGORIES = {
  BED: 'bed',
  LIGHTS: 'lights',
  PLUSHIES: 'plushies',
  WALL: 'wall',
  FLOOR: 'floor',
  MAGIC: 'magic'
};

const ROOM_THEMES = {
  RAINY: { name: 'Rainy', bgClass: 'theme-rainy', music: 'rain.mp3' },
  SAKURA: { name: 'Sakura', bgClass: 'theme-sakura', music: 'sakura.mp3' },
  MIST: { name: 'Mist', bgClass: 'theme-mist', music: 'mist.mp3' },
  NIGHT_SKY: { name: 'Night Sky', bgClass: 'theme-night-sky', music: 'night.mp3' },
  STRAWBERRY: { name: 'Strawberry', bgClass: 'theme-strawberry', music: 'strawberry.mp3' },
  FIRELIGHT: { name: 'Firelight', bgClass: 'theme-firelight', music: 'firelight.mp3' }
};

const DECOR_ITEMS = [
  { id: 'bed1', category: DECOR_CATEGORIES.BED, emoji: '🛏️', unlocked: true },
  { id: 'light1', category: DECOR_CATEGORIES.LIGHTS, emoji: '💡', unlocked: true },
  { id: 'plushie1', category: DECOR_CATEGORIES.PLUSHIES, emoji: '🧸', unlocked: true },
  { id: 'wall1', category: DECOR_CATEGORIES.WALL, emoji: '🌸', unlocked: true },
  { id: 'floor1', category: DECOR_CATEGORIES.FLOOR, emoji: '🌟', unlocked: true },
  { id: 'magic1', category: DECOR_CATEGORIES.MAGIC, emoji: '✨', unlocked: false },
  // More items can be added here
];

const MAGICAL_PETS = [
  { id: 'unicorn', emoji: '🦄', probability: 0.2 },
  { id: 'dragon', emoji: '🐉', probability: 0.1 },
  { id: 'fairy', emoji: '🧚‍♀️', probability: 0.3 }
];

const AVATAR_ACTIONS = {
  HUG: { name: 'Hug', emoji: '🤗' },
  SIT: { name: 'Sit', emoji: '💺' },
  STYLE: { name: 'Style', emoji: '👚' }
};

/**
 * PUBLIC_INTERFACE
 * Room component: Interactive space with drag-and-drop decor, themes, avatar,
 * quote wall, and magical pets. Supports layout saving and theme switching.
 */
function Room() {
  // Persisted state
  const [decorLayout, setDecorLayout] = usePersistedState('room-decor-layout', {});
  const [currentTheme, setCurrentTheme] = usePersistedState('room-theme', ROOM_THEMES.RAINY);
  const [pinnedQuotes, setPinnedQuotes] = usePersistedState('room-quotes', []);
  const [unlockedItems, setUnlockedItems] = usePersistedState('room-unlocked', 
    DECOR_ITEMS.filter(item => item.unlocked).map(item => item.id)
  );

  // Local state
  const [draggingItem, setDraggingItem] = useState(null);
  const [magicalPet, setMagicalPet] = useState(null);
  const [avatarAction, setAvatarAction] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Refs
  const roomRef = useRef(null);
  const audioRef = useRef(null);

  // Handle drag and drop
  const handleDragStart = (item, e) => {
    const roomRect = roomRef.current.getBoundingClientRect();
    const x = e.clientX - roomRect.left;
    const y = e.clientY - roomRect.top;
    
    setDraggingItem({
      item,
      offset: { x, y }
    });
  };

  const handleDrag = (e) => {
    if (!draggingItem) return;

    const roomRect = roomRef.current.getBoundingClientRect();
    const x = e.clientX - roomRect.left - draggingItem.offset.x;
    const y = e.clientY - roomRect.top - draggingItem.offset.y;

    setDecorLayout(prev => ({
      ...prev,
      [draggingItem.item.id]: { x, y }
    }));
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  // Theme handling
  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    if (audioRef.current) {
      audioRef.current.src = theme.music;
      audioRef.current.play().catch(() => {}); // Ignore autoplay blocking
    }
  };

  // Quote wall
  const addQuote = (quote) => {
    if (pinnedQuotes.length >= 5) return; // Max 5 quotes
    setPinnedQuotes(prev => [...prev, quote]);
  };

  const removeQuote = (index) => {
    setPinnedQuotes(prev => prev.filter((_, i) => i !== index));
  };

  // Magical pet system
  useEffect(() => {
    const checkForPet = () => {
      const random = Math.random();
      const pet = MAGICAL_PETS.find(p => random <= p.probability);
      if (pet) {
        setMagicalPet(pet);
        setTimeout(() => setMagicalPet(null), 10000); // Pet disappears after 10s
      }
    };

    const interval = setInterval(checkForPet, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Save/Reset layout
  const saveLayout = () => {
    localStorage.setItem('room-layout-backup', JSON.stringify(decorLayout));
  };

  const resetLayout = () => {
    setDecorLayout({});
  };

  // Render room content
  return (
    <div className="room-container" ref={roomRef}>
      {/* Theme background */}
      <div className={`room-theme ${currentTheme.bgClass}`} />

      {/* Theme audio */}
      <audio ref={audioRef} loop style={{ display: 'none' }} />

      {/* Decor items */}
      {DECOR_ITEMS.filter(item => unlockedItems.includes(item.id)).map(item => (
        <DecorItem
          key={item.id}
          item={item}
          position={decorLayout[item.id] || { x: 0, y: 0 }}
          isDragging={draggingItem?.item.id === item.id}
          onDragStart={(e) => handleDragStart(item, e)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        />
      ))}

      {/* Quote wall */}
      <div className="quote-wall">
        <h3>Wall of You</h3>
        {pinnedQuotes.map((quote, index) => (
          <div key={index} className="quote-item">
            {quote}
            <button onClick={() => removeQuote(index)}>✕</button>
          </div>
        ))}
        {pinnedQuotes.length < 5 && (
          <button onClick={() => addQuote("Your new dream...")}>
            Pin New Quote
          </button>
        )}
      </div>

      {/* Avatar area */}
      <div className="avatar-area">
        <div className="avatar-emoji">
          {avatarAction ? AVATAR_ACTIONS[avatarAction].emoji : '👤'}
        </div>
        <div className="avatar-controls">
          {Object.entries(AVATAR_ACTIONS).map(([key, action]) => (
            <button
              key={key}
              className="avatar-button"
              onClick={() => setAvatarAction(key)}
            >
              {action.emoji} {action.name}
            </button>
          ))}
        </div>
      </div>

      {/* Magical pet (when appears) */}
      {magicalPet && (
        <div className="magical-pet" onClick={() => setMagicalPet(null)}>
          {magicalPet.emoji}
        </div>
      )}

      {/* Room controls */}
      <div className="room-controls">
        <button
          className="control-button"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? '💾 Save' : '✏️ Edit'}
        </button>
        {editMode && (
          <>
            <button className="control-button" onClick={saveLayout}>
              📁 Backup
            </button>
            <button className="control-button" onClick={resetLayout}>
              🔄 Reset
            </button>
          </>
        )}
      </div>

      {/* Theme picker */}
      <GlassyCard
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {Object.entries(ROOM_THEMES).map(([key, theme]) => (
          <button
            key={key}
            className="control-button"
            onClick={() => changeTheme(theme)}
            style={{
              background: currentTheme.name === theme.name
                ? 'linear-gradient(135deg, var(--dreamy-purple) 0%, var(--dreamy-pink) 100%)'
                : 'var(--glassy-bg)'
            }}
          >
            {theme.name}
          </button>
        ))}
      </GlassyCard>
    </div>
  );
}

export default Room;
