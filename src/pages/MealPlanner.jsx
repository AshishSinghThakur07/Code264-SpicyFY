import React, { useState, useContext, useEffect } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const MealPlanner = () => {
  const {
    mealPlanner,
    addMealToPlanner,
    removeMealFromPlanner,
    clearPlanner,
    favorites,
    customRecipes,
    viewRecipe,
    checkedIngredients,
    toggleIngredientChecked,
    clearCheckedIngredients
  } = useContext(RecipeContext);

  // Modal State for adding a recipe
  const [modalActive, setModalActive] = useState(false);
  const [targetSlot, setTargetSlot] = useState({ day: '', mealType: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // List of days
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Search recipes to add to planner
  const searchRecipesForPlanner = async (q) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const lowerQuery = q.toLowerCase().trim();

      // Check custom recipes
      const customMatches = customRecipes.filter(r => 
        (r.strMeal || r.name || '').toLowerCase().includes(lowerQuery)
      );

      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
      const data = await res.json();
      const apiMatches = data.meals || [];

      // Merge and standardise format
      const formattedCustom = customMatches.map(r => ({
        idMeal: r.idMeal || r.id,
        strMeal: r.strMeal || r.name,
        strMealThumb: r.strMealThumb || r.image,
        ingredients: r.ingredients || [],
        isCustom: true
      }));

      setSearchResults([...formattedCustom, ...apiMatches]);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) searchRecipesForPlanner(searchQuery);
      else setSearchResults([]);
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Open selection modal
  const openAddModal = (day, mealType) => {
    setTargetSlot({ day, mealType });
    setSearchQuery('');
    setSearchResults([]);
    setModalActive(true);
  };

  // Add selected recipe to planner
  const handleSelectRecipe = async (recipe) => {
    const { day, mealType } = targetSlot;
    
    // We need to ensure we have the ingredients list.
    // If it's a custom recipe, we already have it in the array.
    // If it's an API recipe, we should fetch its full details to get ingredients.
    let ingredientsList = [];
    
    if (recipe.isCustom) {
      ingredientsList = recipe.ingredients || [];
    } else {
      try {
        const id = recipe.idMeal;
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const fullRecipe = data.meals?.[0];
        
        if (fullRecipe) {
          // Parse ingredients
          for (let i = 1; i <= 20; i++) {
            const ingName = fullRecipe[`strIngredient${i}`];
            const measure = fullRecipe[`strMeasure${i}`];
            if (ingName && ingName.trim() !== '') {
              ingredientsList.push({
                name: ingName.trim(),
                measure: measure ? measure.trim() : ''
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching recipe ingredients for planner:', err);
      }
    }

    addMealToPlanner(day, mealType, {
      ...recipe,
      ingredients: ingredientsList
    });
    setModalActive(false);
  };

  // Aggregated Grocery Checklist compilation
  const compileGroceryList = () => {
    const list = {};

    Object.keys(mealPlanner).forEach(day => {
      Object.keys(mealPlanner[day]).forEach(mealType => {
        const meal = mealPlanner[day][mealType];
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(item => {
            const name = item.name || item.ingredient || '';
            const measure = item.measure || '';
            if (name) {
              const key = name.toLowerCase().trim();
              if (list[key]) {
                if (measure && !list[key].measures.includes(measure)) {
                  list[key].measures.push(measure);
                }
              } else {
                list[key] = {
                  originalName: name,
                  measures: measure ? [measure] : []
                };
              }
            }
          });
        }
      });
    });

    return Object.values(list).sort((a, b) => a.originalName.localeCompare(b.originalName));
  };

  const groceryList = compileGroceryList();

  // State to track if all checklist items are completed
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  // Monitor checklist completion and fire canvas-confetti
  useEffect(() => {
    if (groceryList.length > 0) {
      const allChecked = groceryList.every(item => 
        checkedIngredients.includes(item.originalName.toLowerCase().trim())
      );
      
      if (allChecked) {
        if (!checklistCompleted) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#ef4444', '#f9d423', '#ffffff']
          });
          setChecklistCompleted(true);
        }
      } else {
        setChecklistCompleted(false);
      }
    } else {
      setChecklistCompleted(false);
    }
  }, [checkedIngredients, groceryList, checklistCompleted]);

  return (
    <motion.div
      className="page-container planner-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="planner-header">
        <h1>Weekly Meal Planner</h1>
        <p>Schedule your weekly menu and automatically generate your grocery shopping list</p>
        <button onClick={clearPlanner} className="btn-secondary clear-planner-btn">
          <i className="bi bi-arrow-repeat"></i>
          Reset Entire Plan
        </button>
      </header>

      {/* 7-Day Grid Calendar */}
      <div className="planner-calendar-grid">
        {days.map(day => (
          <div key={day} className="day-card glass-panel">
            <h3 className="day-name">{day}</h3>
            
            <div className="day-meals">
              {mealTypes.map(type => {
                const meal = mealPlanner[day]?.[type];

                return (
                  <div key={type} className="meal-slot-container">
                    <span className="meal-type-label">{type}</span>

                    {meal ? (
                      <div className="meal-filled-card">
                        <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-slot-thumb" />
                        <div className="meal-slot-details">
                          <h4 onClick={() => viewRecipe(meal.idMeal)} className="meal-slot-title">
                            {meal.strMeal}
                          </h4>
                          <button
                            onClick={() => removeMealFromPlanner(day, type)}
                            className="remove-slot-btn"
                            title="Remove meal"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => openAddModal(day, type)} className="add-meal-slot-btn">
                        <i className="bi bi-plus-lg"></i>
                        Add Meal
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Consolidated Grocery List Checklist */}
      <div className="grocery-list-section glass-panel">
        <div className="grocery-header">
          <h2><i className="bi bi-check2-square grocery-icon-title"></i> Grocery Checklist</h2>
          {groceryList.length > 0 && (
            <button onClick={clearCheckedIngredients} className="btn-secondary">
              Reset Checklist
            </button>
          )}
        </div>

        {groceryList.length > 0 ? (
          <>
            <p className="grocery-info-text">
              Consolidated list of ingredients for your scheduled meals. Check items off as you buy them!
            </p>
            <div className="grocery-items-grid">
              {groceryList.map((item) => {
                const isChecked = checkedIngredients.includes(item.originalName.toLowerCase().trim());
                
                return (
                  <div
                    key={item.originalName}
                    className={`grocery-item-row ${isChecked ? 'checked' : ''}`}
                    onClick={() => toggleIngredientChecked(item.originalName)}
                  >
                    <div className="checkbox-indicator">
                      {isChecked ? (
                        <i className="bi bi-check2-square check-box active"></i>
                      ) : (
                        <i className="bi bi-square check-box"></i>
                      )}
                    </div>
                    <div className="grocery-item-text">
                      <span className="ing-name">{item.originalName}</span>
                      {item.measures.length > 0 && (
                        <span className="ing-measure">({item.measures.join(', ')})</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grocery-empty-state">
            <p>No meals scheduled yet. Add recipes to your calendar slots to compile your shopping checklist.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog for Adding Recipe */}
      <AnimatePresence>
        {modalActive && (
          <div className="modal-overlay" onClick={() => setModalActive(false)}>
            <motion.div
              className="modal-content glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="modal-header">
                <h3>Add Meal: {targetSlot.day} ({targetSlot.mealType})</h3>
                <button className="close-modal-btn" onClick={() => setModalActive(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body">
                {/* Custom search bar */}
                <div className="modal-search">
                  <i className="bi bi-search modal-search-icon"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes or cuisines..."
                    className="modal-search-input"
                    autoFocus
                  />
                </div>

                <div className="modal-results-scroll">
                  {searching ? (
                    <div className="loader" />
                  ) : searchQuery.trim() !== '' ? (
                    /* Search results */
                    searchResults.length > 0 ? (
                      <div className="modal-list-results">
                        {searchResults.map(meal => (
                          <div
                            key={meal.idMeal || meal.id}
                            className="modal-list-item"
                            onClick={() => handleSelectRecipe(meal)}
                          >
                            <img src={meal.strMealThumb} alt={meal.strMeal} className="modal-item-thumb" />
                            <div className="modal-item-info">
                              <span className="modal-item-name">{meal.strMeal}</span>
                              <span className="modal-item-meta">{meal.isCustom ? 'Custom Cookbook' : `${meal.strCategory || ''} • ${meal.strArea || ''}`}</span>
                            </div>
                            <i className="bi bi-plus-lg modal-item-plus"></i>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="modal-no-results">No matching recipes found.</p>
                    )
                  ) : (
                    /* Favorites and Custom lists when search empty */
                    <div className="modal-defaults">
                      <h4>❤️ Select from Favorites</h4>
                      {favorites.length > 0 ? (
                        <div className="modal-list-results">
                          {favorites.map(meal => (
                            <div
                              key={meal.idMeal}
                              className="modal-list-item"
                              onClick={() => handleSelectRecipe(meal)}
                            >
                              <img src={meal.strMealThumb} alt={meal.strMeal} className="modal-item-thumb" />
                              <div className="modal-item-info">
                                <span className="modal-item-name">{meal.strMeal}</span>
                                <span className="modal-item-meta">{meal.isCustom ? 'Custom Cookbook' : 'Favorite'}</span>
                              </div>
                              <i className="bi bi-plus-lg modal-item-plus"></i>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="modal-subtext">You have no favorites saved. Type search query to look up dishes.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .planner-page {
          max-width: 1200px;
        }

        .planner-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .planner-header h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .planner-header p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .clear-planner-btn {
          gap: 6px;
          font-size: 0.88rem;
          padding: 8px 20px;
        }

        /* 7-Day Grid Layout */
        .planner-calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .day-card {
          padding: 1.5rem;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .day-name {
          font-size: 1.25rem;
          color: var(--text-primary);
          font-weight: 700;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.75rem;
        }

        .day-meals {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .meal-slot-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .meal-type-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .add-meal-slot-btn {
          width: 100%;
          border: 1px dashed var(--glass-border);
          background: rgba(0, 0, 0, 0.01);
          color: var(--text-secondary);
          padding: 10px;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .add-meal-slot-btn:hover {
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--accent);
          color: var(--accent);
        }

        .meal-filled-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(0, 0, 0, 0.02);
          padding: 8px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--glass-border);
        }

        .meal-slot-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
        }

        .meal-slot-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-grow: 1;
          min-width: 0;
        }

        .meal-slot-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-grow: 1;
          margin-right: 8px;
        }

        .meal-slot-title:hover {
          color: var(--accent-red);
          text-decoration: underline;
        }

        .remove-slot-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }

        .remove-slot-btn:hover {
          color: var(--accent-red);
          background: rgba(239, 68, 68, 0.08);
        }

        /* Grocery Checklist */
        .grocery-list-section {
          padding: 2.5rem;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .grocery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .grocery-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.4rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .grocery-icon-title {
          color: var(--accent);
        }

        .grocery-info-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .grocery-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .grocery-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(0,0,0,0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .grocery-item-row:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.1);
        }

        .grocery-item-row.checked {
          background: rgba(16, 185, 129, 0.04);
          border-color: rgba(16, 185, 129, 0.2);
          opacity: 0.6;
        }

        .checkbox-indicator {
          display: flex;
          align-items: center;
          color: var(--text-muted);
          font-size: 1.25rem;
        }

        .check-box.active {
          color: var(--accent);
        }

        .grocery-item-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .grocery-item-row.checked .ing-name {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .ing-name {
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .ing-measure {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 2px;
          font-weight: 500;
        }

        .grocery-empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg-secondary);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .modal-header h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .close-modal-btn {
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.1rem;
        }

        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          overflow: hidden;
        }

        .modal-search {
          position: relative;
          display: flex;
          align-items: center;
        }

        .modal-search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .modal-search-input {
          width: 100%;
          padding: 10px 10px 10px 38px;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 50px;
          color: var(--text-primary);
          outline: none;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .modal-search-input:focus {
          border-color: var(--accent);
          background: #ffffff;
        }

        .modal-results-scroll {
          overflow-y: auto;
          flex-grow: 1;
          padding-right: 4px;
          min-height: 250px;
        }

        .modal-list-results {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 8px;
          background: rgba(0,0,0,0.01);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .modal-list-item:hover {
          background: rgba(16, 185, 129, 0.08);
          border-color: var(--accent);
        }

        .modal-item-thumb {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 6px;
        }

        .modal-item-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-width: 0;
        }

        .modal-item-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-item-meta {
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .modal-item-plus {
          color: var(--text-muted);
        }

        .modal-list-item:hover .modal-item-plus {
          color: var(--accent);
        }

        .modal-defaults h4 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .modal-subtext {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 2rem;
        }

        .modal-no-results {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 2rem;
        }
      `}</style>
    </motion.div>
  );
};
