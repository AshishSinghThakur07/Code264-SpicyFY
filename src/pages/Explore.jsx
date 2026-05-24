import React, { useState, useEffect } from 'react';
import { MealCard } from '../components/MealCard';
import { motion, AnimatePresence } from 'framer-motion';

export const Explore = () => {
  const [filterType, setFilterType] = useState('category'); // 'category' or 'area'
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setFetchingOptions(true);
        // Fetch Categories
        const catRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const catData = await catRes.json();
        if (catData.meals) {
          setCategories(catData.meals.map(m => m.strCategory).sort());
        }

        // Fetch Areas
        const areaRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const areaData = await areaRes.json();
        if (areaData.meals) {
          setAreas(areaData.meals.map(m => m.strArea).sort());
        }

        // Set default filter selection to first category
        if (catData.meals && catData.meals.length > 0) {
          const firstCat = catData.meals[0].strCategory;
          setSelectedValue(firstCat);
          fetchRecipes('category', firstCat);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      } finally {
        setFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const fetchRecipes = async (type, value) => {
    if (!value) return;
    setLoading(true);
    try {
      const endpoint = type === 'category'
        ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`
        : `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error('Error fetching filtered recipes:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    const defaultVal = type === 'category' ? categories[0] : areas[0];
    setSelectedValue(defaultVal);
    fetchRecipes(type, defaultVal);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    fetchRecipes(filterType, value);
  };

  const handleChipClick = (value) => {
    setSelectedValue(value);
    fetchRecipes(filterType, value);
  };

  return (
    <motion.div
      className="page-container explore-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="explore-header">
        <h1>Explore Recipes</h1>
        <p>Browse culinary creations sorted by global regions or meal types</p>
      </header>

      {fetchingOptions ? (
        <div className="loader" />
      ) : (
        <>
          {/* Filter Toggles */}
          <div className="filter-controls-container glass-panel">
            <div className="filter-toggles">
              <button
                className={`filter-toggle-btn ${filterType === 'category' ? 'active' : ''}`}
                onClick={() => handleFilterTypeChange('category')}
              >
                <i className="bi bi-journal-text"></i>
                By Category
              </button>
              <button
                className={`filter-toggle-btn ${filterType === 'area' ? 'active' : ''}`}
                onClick={() => handleFilterTypeChange('area')}
              >
                <i className="bi bi-globe"></i>
                By Cuisine Area
              </button>
            </div>

            {/* Dropdown Selector */}
            <div className="selector-wrapper">
              <i className="bi bi-filter selector-icon"></i>
              <select
                value={selectedValue}
                onChange={handleValueChange}
                className="filter-select"
              >
                {filterType === 'category'
                  ? categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  : areas.map(area => <option key={area} value={area}>{area}</option>)
                }
              </select>
            </div>
          </div>

          {/* Quick-select chips list */}
          <div className="explore-chips-container">
            {(filterType === 'category' ? categories : areas).map(val => (
              <button
                key={val}
                className={`explore-chip ${selectedValue === val ? 'active' : ''}`}
                onClick={() => handleChipClick(val)}
              >
                {val}
              </button>
            ))}
          </div>

          {/* Recipes Display Area */}
          <div className="explore-results-section">
            <h2 className="explore-results-title">
              Featured {selectedValue} Dishes ({recipes.length})
            </h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loader" />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="explore-grid"
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
                  {recipes.map(recipe => (
                    <MealCard key={recipe.idMeal} recipe={recipe} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <style>{`
        .explore-page {
          max-width: 1200px;
        }

        .explore-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .explore-header h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .explore-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .filter-controls-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          gap: 1.5rem;
          flex-wrap: wrap;
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .filter-toggles {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: 50px;
          padding: 4px;
          border: 1px solid var(--glass-border);
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-toggle-btn:hover {
          color: var(--text-primary);
        }

        .filter-toggle-btn.active {
          background: var(--accent-gradient);
          color: white;
          box-shadow: 0 4px 10px var(--accent-glow);
        }

        .selector-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .selector-icon {
          position: absolute;
          left: 16px;
          color: var(--text-secondary);
          pointer-events: none;
          font-size: 1.1rem;
        }

        .filter-select {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 12px 20px 12px 42px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          min-width: 220px;
          transition: var(--transition-smooth);
          appearance: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .filter-select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }

        .explore-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 3.5rem;
          justify-content: center;
        }

        .explore-chip {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 2px 8px rgba(0,0,0,0.01);
        }

        .explore-chip:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .explore-chip.active {
          background: rgba(16, 185, 129, 0.08);
          color: var(--accent);
          border-color: var(--accent);
        }

        .explore-results-section {
          width: 100%;
        }

        .explore-results-title {
          font-size: 1.4rem;
          color: var(--text-primary);
          margin-bottom: 2rem;
          font-weight: 700;
          border-left: 4px solid var(--accent);
          padding-left: 12px;
        }

        .explore-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .filter-controls-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-toggles {
            width: 100%;
            justify-content: center;
          }

          .filter-toggle-btn {
            flex: 1;
            justify-content: center;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};
