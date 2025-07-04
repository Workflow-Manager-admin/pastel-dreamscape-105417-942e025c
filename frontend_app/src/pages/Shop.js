import React, { useState, useEffect, useMemo } from "react";
import GlassyCard from "../components/GlassyCard";

/**
 * PUBLIC_INTERFACE
 * Magical Shop: Dreamy pastel glassmorphic shop UI to purchase decor, outfits, sounds.
 * Features search, sort, filter, animated purchase UI, and unlockable items based on journaling streak.
 * All design in glassmorphic, pastel "cloud" style with dreamy sparkles.
 */

// --- Mocked (localStorage) Earned Values via Journaling Streak/Progress (for gating unlocks) ---
function getJournalStats() {
  // For demo: check localStorage for user's journaling activity
  try {
    const raw = window.localStorage.getItem("dreamscape-journal-entries");
    if (!raw) return { entries: 0, days: 0 };
    const obj = JSON.parse(raw);
    const days = Object.keys(obj || {}).length;
    const totalLines = Object.values(obj ?? {}).reduce(
      (sum, o) => sum + ((o?.text || "").split('\n').filter(Boolean).length),
      0
    );
    return { entries: days, lines: totalLines };
  } catch {
    return { entries: 0, days: 0 };
  }
}

// --- Catalog: Decor, Outfits, Sounds (all pastel, with lock levels) ---
const SHOP_CATALOG = [
  // decor
  {
    id: "plant-1",
    type: "decor",
    name: "Pastel Plant",
    emoji: "🪴",
    desc: "A soft, leafy friend for your floating room.",
    price: 7,
    unlockReq: 0,
    accent: "#abf5c4",
  },
  {
    id: "cloud-1",
    type: "decor",
    name: "Fluffy Cloud",
    emoji: "☁️",
    desc: "Drifts gently in your dreamy room space.",
    price: 8,
    unlockReq: 1,
    accent: "#caaaff",
  },
  {
    id: "star-light",
    type: "decor",
    name: "Star Light",
    emoji: "✨",
    desc: "Gleaming sparkles for a magical night mood.",
    price: 10,
    unlockReq: 2,
    accent: "#ffabd2",
  },
  {
    id: "heart-cushion",
    type: "decor",
    name: "Heart Cushion",
    emoji: "💖",
    desc: "For pastel, loving comfort always.",
    price: 9,
    unlockReq: 2,
    accent: "#ffeaf4",
  },
  // outfits
  {
    id: "dream-gown",
    type: "outfit",
    name: "Dream Gown",
    emoji: "🩰",
    desc: "Ethereal pastel ballet dress, float with grace.",
    price: 13,
    unlockReq: 4,
    accent: "#ffabd2",
  },
  {
    id: "bunny-onesie",
    type: "outfit",
    name: "Bunny Onesie",
    emoji: "🐰",
    desc: "Soft and playful, for gentle moods.",
    price: 15,
    unlockReq: 3,
    accent: "#caaaff",
  },
  {
    id: "galaxy-jacket",
    type: "outfit",
    name: "Galaxy Jacket",
    emoji: "🪐",
    desc: "For stargazers with heart.",
    price: 17,
    unlockReq: 6,
    accent: "#b477e0",
  },
  // sounds
  {
    id: "lofi-pack",
    type: "sound",
    name: "Lo-fi Soundpack",
    emoji: "🎧",
    desc: "Soft lo-fi rain and cozy pastel beats.",
    price: 11,
    unlockReq: 2,
    accent: "#ab85ca",
  },
  {
    id: "rain-ambience",
    type: "sound",
    name: "Rain Ambience",
    emoji: "🌧️",
    desc: "For sleep, study, and gentle focus.",
    price: 8,
    unlockReq: 4,
    accent: "#b477e0",
  },
  {
    id: "magic-music",
    type: "sound",
    name: "Magic Music Box",
    emoji: "🎼",
    desc: "Tinkly, enchanted music for daydreamers.",
    price: 14,
    unlockReq: 5,
    accent: "#ffeaf4",
  },
];

// Type/color options for filtering
const TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Decor", value: "decor" },
  { label: "Outfits", value: "outfit" },
  { label: "Sounds", value: "sound" }
];

const SORT_OPTIONS = [
  { label: "A-Z", value: "az" },
  { label: "Price ↑", value: "priceLow" },
  { label: "Price ↓", value: "priceHigh" },
  { label: "Unlocks ↑", value: "unlockLow" },
  { label: "Unlocks ↓", value: "unlockHigh" }
];

// Persistent "stars" for demo (feel-free: collect by journaling)
function getUserStars() {
  try {
    return parseInt(window.localStorage.getItem("dreamscape-user-stars") || "38", 10);
  } catch {
    return 38;
  }
}
function setUserStars(v) {
  window.localStorage.setItem("dreamscape-user-stars", String(v));
}

// Persistent purchasedItems
function getUserInventory() {
  try {
    return JSON.parse(window.localStorage.getItem("dreamscape-inventory") || "[]");
  } catch {
    return [];
  }
}
function setUserInventory(arr) {
  window.localStorage.setItem("dreamscape-inventory", JSON.stringify(arr));
}

// --- Main Shop Component ---
function Shop() {
  // journaling stats for unlock levels
  const [journalStats, setJournalStats] = useState({ entries: 0, lines: 0 });
  // filter/sort/search state
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("az");
  // stars & inventory
  const [userStars, setStars] = useState(getUserStars());
  const [inventory, setInventory] = useState(getUserInventory());
  // animated purchase state
  const [shopModal, setShopModal] = useState(null); // {item, status: 'ready'|'success'}

  // update stats on mount
  useEffect(() => {
    setJournalStats(getJournalStats());
  }, []);

  // filter/search/sort catalog in memory
  const catalog = useMemo(() => {
    let list = SHOP_CATALOG;
    if (typeFilter) list = list.filter(i => i.type === typeFilter);
    if (search.trim())
      list = list.filter(
        i =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.desc.toLowerCase().includes(search.toLowerCase())
      );
    switch (sortOrder) {
      case "az":
        list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceLow":
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case "unlockLow":
        list = list.slice().sort((a, b) => a.unlockReq - b.unlockReq);
        break;
      case "unlockHigh":
        list = list.slice().sort((a, b) => b.unlockReq - a.unlockReq);
        break;
      default:
        break;
    }
    return list;
  }, [typeFilter, search, sortOrder]);

  // handle purchase
  function handlePurchase(item) {
    if (userStars < item.price || inventory.includes(item.id)) return;
    // Animate!
    setShopModal({ item, status: "ready" });
    setTimeout(() => {
      // reduce stars, add item
      setStars(stars => {
        setUserStars(stars - item.price);
        return stars - item.price;
      });
      setInventory(inv => {
        const updated = [...inv, item.id];
        setUserInventory(updated);
        return updated;
      });
      setShopModal({ item, status: "success" });
    }, 1200);
  }

  // handle close modal
  function closeModal() {
    setShopModal(null);
  }

  // check unlock gating for each item
  function isUnlocked(item) {
    return journalStats.entries >= item.unlockReq;
  }
  // soft animation confetti (pastel starfall)
  function AnimatedConfetti({ show, item }) {
    if (!show) return null;
    return (
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 39,
          opacity: 0.93,
          transition: "opacity .2s"
        }}
      >
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${7 + (i * 17 + i * 3) % 91}%`,
              top: `${1 + (i * 23 + i * 9) % 93}%`,
              fontSize: `${21 + 8 * (i % 3)}px`,
              opacity: 0.58 + (i * 0.1) % 0.37,
              filter: "blur(1.1px) brightness(1.13)",
              animation: `starfallDrop 1.67s ${(i * .11)}s linear forwards`,
              userSelect: "none"
            }}
            role="img" aria-label="shop sparkle"
          >
            {item?.emoji || "✨"}
          </span>
        ))}
        <style>
{`
@keyframes starfallDrop {
  0% { transform: translateY(-80px) scale(1); opacity: 0.9;}
  80% { opacity: 0.88;}
  100% { transform: translateY(80vh) scale(1.12); opacity: 0.15;}
}
`}
        </style>
      </div>
    );
  }

  // UI
  return (
    <section style={{ minHeight: "93vh", width: "100%", position: "relative" }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        {/* Dreamy shop header */}
        <h1
          className="dreamy-accent-text"
          style={{
            fontWeight: 900,
            fontSize: "2.35rem",
            letterSpacing: "-.013em",
            marginTop: 46,
            textAlign: "center",
            color: "#ffabd2",
            textShadow: "0 2px 28px #ffeaf477"
          }}
        >
          Magical Shop
        </h1>
        <span style={{
          color: "#b477e0",
          fontWeight: 530,
          fontSize: 18.5,
          textAlign: "center",
          marginBottom: 8
        }}>
          Spend your <span role="img" aria-label="stars">✨</span> stars <span role="img" aria-label="heart">💖</span> for decor, outfits, and soundpacks!
          <br />
          Unlock more items by journaling your feelings — every soft moment counts.
        </span>
        {/* Glassy wallet summary (stars, journal stats) */}
        <div style={{
          display: "flex", gap: 22, alignItems: "center", margin: "18px 0 17px 0",
          flexWrap: "wrap"
        }}>
          <GlassyCard
            accentColor="#ffabd2"
            style={{
              minWidth: 123, minHeight: 71, padding: "0.9em 1em", fontWeight: 600, color: "#b477e0",
              background: "rgba(255,255,255,0.44)"
            }}
            className="shop-wallet"
          >
            <span role="img" aria-label="star" style={{ fontSize: 23, marginRight: 7 }}>✨</span>
            <span style={{ color: "#ffabd2", fontWeight: 700 }}>{userStars}</span>{" "}
            <span style={{ fontWeight: 600, fontSize: 14.1, color: "#bcaede" }}>stars</span>
          </GlassyCard>
          <GlassyCard
            accentColor="#caaaff"
            style={{
              minWidth: 123, minHeight: 71, padding: "0.8em 1em", fontWeight: 600, color: "#b477e0",
              background: "rgba(255,255,255,0.44)"
            }}
            className="shop-entries"
          >
            <span role="img" aria-label="journal" style={{ fontSize: 20, marginRight: 6 }}>📓</span>
            <span style={{ color: "#caaaff", fontWeight: 700 }}>{journalStats.entries}</span>
            <span style={{ fontWeight: 600, fontSize: 14.1, color: "#bcaede" }}> entries</span>
          </GlassyCard>
        </div>
      </div>

      {/* Controls */}
      <GlassyCard
        accentColor="#ab85ca"
        style={{
          margin: "0 auto", maxWidth: 760, marginBottom: 22, marginTop: 2, padding: "1.1em 1.5em 0.6em",
          display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "center",
        }}
      >
        <div>
          <label style={{ fontWeight: 700, color: "#b477e0", fontSize: 15.8 }}>Category: </label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              borderRadius: 11,
              border: "2px solid #caaaff",
              padding: "4px 15px",
              marginRight: 9,
              fontSize: 15.1,
              color: "#b477e0",
              fontWeight: 600
            }}
            aria-label="Filter by type"
          >
            {TYPE_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 700, color: "#ffabd2", fontSize: 15.8 }}>Sort: </label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{
              borderRadius: 11,
              border: "2px solid #ffabd2",
              padding: "4px 15px",
              fontSize: 15.1,
              color: "#ffabd2",
              fontWeight: 600
            }}
            aria-label="Sort order"
          >
            {SORT_OPTIONS.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search dreamy items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              borderRadius: 12,
              border: "2px solid #caaaff",
              padding: "4px 15px",
              fontSize: 15.1,
              minWidth: 137
            }}
            aria-label="Search"
          />
        </div>
      </GlassyCard>

      {/* Catalog: dreamy grid */}
      <div
        className="dreamy-card-grid"
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto 70px auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(209px,1fr))",
          gap: "1.6rem 1.12rem",
          justifyItems: "center",
          position: "relative"
        }}
      >
        {catalog.length === 0 && (
          <GlassyCard accentColor="#ffabd2" style={{ textAlign: "center", fontWeight: 600, color: "#b477e0" }}>
            No items match. Try another filter or search term.
          </GlassyCard>
        )}
        {catalog.map(item => {
          const unlocked = isUnlocked(item);
          const owned = inventory.includes(item.id);
          return (
            <GlassyCard
              key={item.id}
              accentColor={item.accent}
              className="shop-item"
              style={{
                minHeight: 210,
                maxWidth: 270,
                minWidth: 170,
                opacity: unlocked ? 1 : 0.63,
                boxShadow: owned
                  ? "0 2px 32px 0 #caaaff77, 0 0px 6px #ffabd277"
                  : "0 2px 12px #b477e088",
                transform: owned ? "scale(1.035)" : undefined,
                transition: "box-shadow .15s, opacity .15s, transform .13s",
                background: owned
                  ? "linear-gradient(105deg,#caaaff44 40%,#ffeaf488 100%)"
                  : "rgba(255,255,255,0.45)",
                marginBottom: 12
              }}
            >
              {/* Sparkle on owned */}
              {owned && (
                <span
                  role="img"
                  aria-label="Owned"
                  style={{
                    position: "absolute",
                    right: 15, top: 15,
                    fontSize: 26,
                    filter: "blur(0.1px) brightness(1.18) drop-shadow(0 2px 8px #caaaff88)"
                  }}
                  title="Already purchased"
                >
                  🌟
                </span>
              )}
              <div style={{
                fontSize: 44,
                marginBottom: 8,
                filter: "drop-shadow(0 2px 18px #caaaff33)",
                opacity: unlocked ? 1 : 0.62
              }}>
                {item.emoji}
              </div>
              <div style={{
                fontWeight: 800,
                color: item.accent,
                fontSize: "1.19rem",
                letterSpacing: ".006em"
              }}>{item.name}</div>
              <div style={{
                color: "#b477e0", fontWeight: 570,
                fontSize: 15.2, marginBottom: 5,
                marginTop: 3
              }}>{item.desc}</div>
              {/* Price footer and gating */}
              <div style={{
                marginTop: 8,
                display: "flex", justifyContent: "center", alignItems: "center", gap: 11
              }}>
                <span style={{
                  color: owned ? "#b477e0" : "#ffabd2",
                  fontWeight: 700,
                  fontSize: 17.7
                }}>
                  {item.price} <span style={{ fontSize: 18 }}>✨</span>
                </span>
                {!unlocked && (
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#bcaede",
                      fontSize: 13.5,
                      background: "rgba(202,170,255,0.11)",
                      border: "1.5px solid #ffabd233",
                      borderRadius: 16,
                      padding: "1px 7px"
                    }}
                    title="Journal to unlock"
                  >🔒 {`Entry x${item.unlockReq}`}</span>
                )}
                {unlocked && !owned && (
                  <button
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(89deg, #ffabd2 49%, #caaaff 100%)",
                      border: "none",
                      boxShadow: "0 2px 10px #caaaff22",
                      borderRadius: 13,
                      fontSize: 15.1,
                      padding: "5.5px 19px",
                      marginLeft: 2,
                      cursor: userStars < item.price ? "not-allowed" : "pointer",
                      opacity: userStars < item.price ? 0.75 : 1,
                      transition: "background .12s"
                    }}
                    disabled={userStars < item.price}
                    onClick={() => handlePurchase(item)}
                  >
                    buy
                  </button>
                )}
              </div>
            </GlassyCard>
          );
        })}
      </div>

      {/* Floating animated shop modal for purchasing */}
      {shopModal && (
        <div
          style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 99,
            background: "rgba(202,170,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={closeModal}
          aria-modal="true"
        >
          <div
            style={{
              minWidth: 270,
              maxWidth: 360,
              background: "rgba(255,255,255,0.86)",
              borderRadius: 34,
              boxShadow: "0 5px 38px #caaaff44, 0 2px 20px #ffabd266",
              padding: "2.2em 1.3em 1.8em 1.3em",
              backdropFilter: "blur(28px)",
              border: "2.5px solid #ffabd2",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "scale(1)",
              animation: shopModal.status === "ready"
                ? "modalPopIn .88s cubic-bezier(.48,-.12,.49,1.13)"
                : "modalPopOut .91s cubic-bezier(.50,-.02,.20,1.06)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 46, marginBottom: 8, filter: "drop-shadow(0 2px 19px #caaaff99)" }}>
              {shopModal.item.emoji}
            </div>
            <div className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: 21, color: "#b477e0" }}>
              {shopModal.status === "ready" ? "Purchasing…" : "Purchased!"}
            </div>
            <div style={{ color: "#ffabd2", fontWeight: 600, fontSize: 16.3, margin: "12px 0 12px" }}>
              {shopModal.item.name}
            </div>
            {shopModal.status === "ready" && (
              <div style={{
                width: "95%", height: 11, background: "#ffeaf488", borderRadius: 8, overflow: "hidden", marginBottom: 5
              }}>
                <div style={{
                  width: "100%", height: 11, background: "linear-gradient(89deg, #ffabd2 49%, #caaaff 100%)",
                  animation: "purchaseProgress 1.14s linear"
                }} />
              </div>
            )}
            {shopModal.status === "success" && (
              <div style={{
                fontWeight: 650, color: "#ab85ca", fontSize: 15.3, marginTop: 7,
                textAlign: "center"
              }}>
                Added to your inventory! <br />
                <span role="img" aria-label="star">✨</span> Try it out in your Room/Outfits!
              </div>
            )}
            <button
              onClick={closeModal}
              aria-label="Close"
              style={{
                marginTop: 18,
                background: "linear-gradient(88deg,#caaaff 60%,#ffabd222 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 18,
                padding: "0.5em 2.1em",
                fontWeight: 700,
                fontSize: "1.03em",
                boxShadow: "0 2px 13px #ffabd233",
                cursor: "pointer",
                opacity: shopModal.status === "ready" ? 0.7 : 1,
                pointerEvents: shopModal.status === "ready" ? "none" : "auto"
              }}
              tabIndex={shopModal.status === "success" ? 0 : -1}
              disabled={shopModal.status === "ready"}
            >
              {shopModal.status === "ready" ? "..." : "close"}
            </button>
            {/* Modal entry animation */}
            <style>{`
@keyframes modalPopIn { 
  0% { opacity: 0; transform: scale(.92);} 
  68% { opacity: 1; filter: blur(1.2px);} 
  100% { opacity: 1; transform: scale(1);}
}
@keyframes modalPopOut { 
  0% { opacity: 1;} 
  100% { opacity: 0.95; filter: blur(2.3px);}
}
@keyframes purchaseProgress {
  0% { width: 0; }
  100% { width: 100%; }
}
`}</style>
          </div>
          <AnimatedConfetti show={shopModal.status === "success"} item={shopModal.item} />
        </div>
      )}

      {/* Soft instruction for unlocks */}
      <div style={{ textAlign: "center", marginTop: 5, color: "#b477e0", fontSize: "1.13em", fontWeight: 500 }}>
        More items unlock as you journal your soft feelings. Gently see <span role="img" aria-label="journal">📓</span> <b>entries</b> above!
      </div>
      {/* Keyframes for grid floating sparkles */}
      <style>
        {`
          @keyframes floatSparkle {
            0% { transform: translateY(0) scale(1); opacity: 0.85;}
            70% { transform: translateY(27px) scale(1.15); opacity: 0.9;}
            100% { transform: translateY(-21px) scale(0.95); opacity: 0.37;}
          }
          @media (max-width: 768px) {
            .dreamy-card-grid {
              grid-template-columns: 1fr 1fr;
              max-width: 99vw;
            }
          }
          @media (max-width: 620px) {
            .dreamy-card-grid {
              grid-template-columns: 1fr;
              gap: 1.01rem 0.2rem;
              margin: 0 0 25px 0;
            }
          }
        `}
      </style>
    </section>
  );
}

export default Shop;
