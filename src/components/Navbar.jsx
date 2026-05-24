import React, { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { currentPage, setPage, favorites, vibeTheme, toggleVibeTheme, playKitchenBell } = useContext(RecipeContext);

  const navItems = [
    { id: 'home', label: 'Home', iconClass: 'bi bi-house-door' },
    { id: 'explore', label: 'Explore', iconClass: 'bi bi-compass' },
    { id: 'favorites', label: 'Favorites', iconClass: 'bi bi-heart', badge: favorites.length },
    { id: 'planner', label: 'Planner', iconClass: 'bi bi-calendar3' },
    { id: 'add-recipe', label: 'Add Recipe', iconClass: 'bi bi-plus-circle' }
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-content glass-panel">
        <div className="brand" onClick={() => { playKitchenBell(); setPage('home'); }}>
          <i className={`${vibeTheme === 'spicy' ? 'bi bi-fire' : 'bi bi-sprout'} brand-icon`}></i>
          <span className="brand-text">Spicy-Fy</span>
        </div>

        <div className="nav-controls-wrapper">
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;

              return (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => { playKitchenBell(); setPage(item.id); }}
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                  >
                    <i className={`${item.iconClass} nav-icon`}></i>
                    <span className="nav-label">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="badge">{item.badge}</span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="active-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="vertical-divider-nav" />

          {/* Vibe Theme Switcher */}
          <button
            onClick={toggleVibeTheme}
            className={`vibe-switcher-btn ${vibeTheme}`}
            title="Toggle Spicy / Healthy Vibe Theme"
          >
            <motion.span 
              key={vibeTheme}
              initial={{ scale: 0.6, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="vibe-emoji"
            >
              {vibeTheme === 'spicy' ? '🌶️' : '🥗'}
            </motion.span>
            <span className="vibe-text">
              {vibeTheme === 'spicy' ? 'Spicy Vibe' : 'Healthy Vibe'}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: center;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          padding: 0.5rem 1.5rem;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 800;
          font-size: 1.45rem;
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: var(--transition-smooth);
        }

        .brand:hover {
          transform: scale(1.03);
        }

        .brand-icon {
          color: var(--accent) !important;
          -webkit-text-fill-color: var(--accent) !important;
          background: none !important;
          -webkit-background-clip: border-box !important;
          font-size: 1.6rem;
          transition: var(--transition-smooth);
        }

        .nav-controls-wrapper {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 0.25rem;
          align-items: center;
        }

        .nav-link-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.6rem 1.1rem;
          font-size: 0.98rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 50px;
        }

        .nav-link-btn:hover {
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.03);
        }

        .nav-link-btn.active {
          color: var(--accent);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .vertical-divider-nav {
          width: 1px;
          height: 24px;
          background: var(--glass-border);
        }

        /* Vibe Switcher Button */
        .vibe-switcher-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--glass-border);
          background: white;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-elastic);
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          color: var(--text-primary);
          font-family: var(--font-family-header) !important;
        }

        .vibe-switcher-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.04);
        }

        .vibe-switcher-btn.spicy {
          border-color: rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.03);
          color: #ef4444;
        }

        .vibe-switcher-btn.healthy {
          border-color: rgba(16, 185, 129, 0.2);
          background: rgba(16, 185, 129, 0.03);
          color: #10b981;
        }

        .vibe-emoji {
          font-size: 1.1rem;
          display: inline-block;
        }

        .nav-link-btn .badge {
          background: var(--accent);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          position: absolute;
          top: -2px;
          right: -2px;
          box-shadow: 0 2px 8px var(--accent-glow);
          transition: var(--transition-smooth);
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 3px;
          background: var(--accent-gradient);
          border-radius: 20px;
          box-shadow: 0 0 8px var(--accent-glow);
        }

        @media (max-width: 992px) {
          .vibe-text {
            display: none;
          }
          .vibe-switcher-btn {
            padding: 8px;
            width: 38px;
            height: 38px;
            justify-content: center;
            border-radius: 50%;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.75rem 1rem;
          }
          
          .navbar-content {
            padding: 0.5rem 1rem;
          }

          .brand-text {
            display: none;
          }

          .nav-label {
            display: none;
          }

          .nav-link-btn {
            padding: 0.6rem 0.8rem;
          }

          .nav-link-btn .badge {
            top: 2px;
            right: 2px;
          }
          .vertical-divider-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
