import React from "react";

/**
 * PUBLIC_INTERFACE
 * GlassyCard: A floating, glassmorphic pastel card with sparkly/star accent.
 * Use for home navigation, dreamy accent cards, etc.
 * Props:
 *   - children: main card content
 *   - accentColor: optional CSS color for card border/accent
 *   - style: additional style overrides
 *   - className: additional class for styling
 */
function GlassyCard({ children, accentColor = "#caaaff", style = {}, className = "", tabIndex, ...props }) {
  return (
    <div
      className={`glassy-card dreamy-card ${className}`}
      style={{
        border: `2.7px solid ${accentColor}`,
        boxShadow:
          "0 8px 32px 0 rgba(202,170,255,0.16), 0 0px 2px rgba(255, 171, 210, .08)",
        ...style
      }}
      tabIndex={tabIndex}
      role="region"
      aria-label={props['aria-label'] || "Glassy card"}
      {...props}
    >
      <div className="card-sparkles" aria-hidden="true">
        {[...Array(7)].map((_, i) => (
          <span key={i} className={`card-sparkle sparkle-${i % 3}`}></span>
        ))}
      </div>
      {children}
    </div>
  );
}

export default GlassyCard;
