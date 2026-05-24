import React, { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { MealCard } from '../components/MealCard';
import { motion } from 'framer-motion';

export const Favorites = () => {
  const { favorites, setPage } = useContext(RecipeContext);

  return (
    <motion.div
      className="page-container favorites-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="favorites-header">
        <h1>My Favorite Recipes</h1>
        <p>A collection of your favorite culinary recipes saved for quick access</p>
      </header>

      {favorites.length > 0 ? (
        <motion.div
          className="favorites-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal || meal.id} recipe={meal} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="empty-favorites glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="empty-icon-wrapper">
            <i className="bi bi-heart empty-heart-icon"></i>
          </div>
          <h2>Your Collection is Empty</h2>
          <p>
            You haven't saved any recipes yet! Explore dishes on the home dashboard and click the heart icon on any card to save it here.
          </p>
          <button onClick={() => setPage('home')} className="btn-primary empty-btn">
            <i className="bi bi-search"></i>
            Discover Recipes
          </button>
        </motion.div>
      )}

      <style>{`
        .favorites-page {
          max-width: 1200px;
        }

        .favorites-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .favorites-header h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .favorites-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .empty-favorites {
          max-width: 550px;
          margin: 0 auto;
          padding: 4rem 2.5rem;
          text-align: center;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .empty-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.08);
          color: var(--accent-red);
          margin-bottom: 1.5rem;
          font-size: 2.2rem;
        }

        .empty-heart-icon {
          animation: pulse 2s infinite ease-in-out;
          display: inline-block;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .empty-favorites h2 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .empty-favorites p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.98rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .empty-btn {
          padding: 12px 30px;
        }
      `}</style>
    </motion.div>
  );
};
