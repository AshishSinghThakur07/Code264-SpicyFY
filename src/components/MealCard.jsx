import React, { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { motion } from 'framer-motion';

export const MealCard = ({ recipe }) => {
  const { toggleFavorite, isFavorite, viewRecipe } = useContext(RecipeContext);

  const recipeId = recipe.idMeal || recipe.id;
  const isFav = isFavorite(recipeId);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  const handleCardClick = () => {
    viewRecipe(recipeId);
  };

  return (
    <motion.div
      className="meal-card glass-panel"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="image-container">
        <img
          src={recipe.strMealThumb || recipe.image}
          alt={recipe.strMeal || recipe.name}
          className="meal-image"
          loading="lazy"
        />
        <div className="card-overlay" />
        
        {/* Floating Category Badge */}
        {(recipe.strCategory || recipe.category) && (
          <span className="category-badge">
            {recipe.strCategory || recipe.category}
          </span>
        )}

        {/* Favorite Heart Button */}
        <motion.button
          onClick={handleFavoriteClick}
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <i className={isFav ? "bi bi-heart-fill heart-icon" : "bi bi-heart heart-icon"}></i>
        </motion.button>
      </div>

      <div className="meal-card-content">
        <h3 className="meal-title">{recipe.strMeal || recipe.name}</h3>
        
        <div className="card-footer">
          <span className="area-info">
            {recipe.strArea || recipe.area ? `🌍 ${recipe.strArea || recipe.area}` : '👨‍🍳 Recipe'}
          </span>
          <button className="view-details-btn">
            View Details
            <i className="bi bi-arrow-right arrow-icon"></i>
          </button>
        </div>
      </div>

      <style>{`
        .meal-card {
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-secondary);
        }

        .meal-card:hover {
          border-color: rgba(239, 68, 68, 0.15);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06), 0 0 12px rgba(16, 185, 129, 0.05);
        }

        .image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .meal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .meal-card:hover .meal-image {
          transform: scale(1.08);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(0,0,0,0.15) 100%);
          pointer-events: none;
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: var(--text-primary);
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: var(--text-secondary);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .favorite-btn:hover {
          background: #ffffff;
          color: var(--accent-red);
        }

        .favorite-btn.active {
          background: var(--accent-red);
          color: white;
          border-color: transparent;
          box-shadow: 0 0 10px var(--accent-red-glow);
        }

        .meal-card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }

        .meal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .area-info {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .view-details-btn {
          background: transparent;
          border: none;
          color: var(--accent-red);
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .view-details-btn:hover {
          color: var(--accent);
        }

        .view-details-btn:hover .arrow-icon {
          transform: translateX(4px);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }
      `}</style>
    </motion.div>
  );
};
