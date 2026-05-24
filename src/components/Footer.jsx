import React, { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const Footer = () => {
  const { setPage } = useContext(RecipeContext);

  const handleQuickLink = (e, tab) => {
    e.preventDefault();
    setPage(tab);
  };

  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-section brand-section">
          <h3><i className="bi bi-fire brand-footer-icon"></i> Spicy-Fy</h3>
          <p>
            Discover thousands of delicious recipes from around the world. Design your weekly menus, export shopping checklists, and catalog your own family recipes.
          </p>
        </div>

        <div className="footer-section links-section">
          <h4>Explore Channels</h4>
          <ul>
            <li><a href="#" onClick={(e) => handleQuickLink(e, 'home')}>Search Dashboard</a></li>
            <li><a href="#" onClick={(e) => handleQuickLink(e, 'explore')}>Advanced Discovery</a></li>
            <li><a href="#" onClick={(e) => handleQuickLink(e, 'planner')}>Weekly Meal Planner</a></li>
            <li><a href="#" onClick={(e) => handleQuickLink(e, 'add-recipe')}>Add Custom Recipe</a></li>
          </ul>
        </div>

        <div className="footer-section connect-section">
          <h4>Connect With Us</h4>
          <p>Get in touch or check out the developer's work:</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/ashishsinghbhadauriya" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://github.com/AshishSinghThakur07" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="GitHub">
              <i className="bi bi-github"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Spicy-Fy. All rights reserved.</p>
        <p className="powered-by">
          Created with <i className="bi bi-heart-fill heart-icon"></i> for Foodies worldwide. Powered by TheMealDB API.
        </p>
      </div>

      <style>{`
        .footer {
          margin-top: 5rem;
          border-radius: 0px;
          border-left: none;
          border-right: none;
          border-bottom: none;
          padding: 4rem 2rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 -10px 30px rgba(0,0,0,0.02);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto 3rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr;
          gap: 4rem;
        }

        .footer-section h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-footer-icon {
          color: var(--accent-red);
        }

        .footer-section h4 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.2rem;
          letter-spacing: 0.5px;
        }

        .footer-section p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .footer-section ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-section ul a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .footer-section ul a:hover {
          color: var(--accent-red);
          padding-left: 4px;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          color: var(--text-secondary);
          transition: var(--transition-elastic);
          text-decoration: none;
        }

        .social-link-btn:hover {
          background: var(--accent-gradient);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 5px 15px var(--accent-red-glow);
          border-color: transparent;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .powered-by {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .heart-icon {
          color: var(--accent-red);
          animation: beat 1.5s infinite;
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
