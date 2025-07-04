import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Draggable decor item component with animations and sparkles
 */
const DecorItem = ({ item, position, onDragStart, onDragEnd, onDrag, isDragging }) => {
  return (
    <div
      className={`decor-item ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        fontSize: '2.5rem',
        filter: isDragging ? 
          'drop-shadow(0 4px 12px rgba(202,170,255,0.4))' : 
          'drop-shadow(0 2px 8px rgba(255,171,210,0.3))',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        zIndex: isDragging ? 1000 : 1
      }}
      onMouseDown={onDragStart}
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDrag}
      onTouchEnd={onDragEnd}
    >
      {item.emoji}
      <div className="sparkle-overlay" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              left: `${10 + (i * 30)}%`,
              top: `${10 + (i * 20)}%`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            ✨
          </span>
        ))}
      </div>
    </div>
  );
};

export default DecorItem;
