import React, { createContext, useState, useEffect } from 'react';

export const RecipeContext = createContext();

const defaultPlanner = {
  Monday: { Breakfast: null, Lunch: null, Dinner: null },
  Tuesday: { Breakfast: null, Lunch: null, Dinner: null },
  Wednesday: { Breakfast: null, Lunch: null, Dinner: null },
  Thursday: { Breakfast: null, Lunch: null, Dinner: null },
  Friday: { Breakfast: null, Lunch: null, Dinner: null },
  Saturday: { Breakfast: null, Lunch: null, Dinner: null },
  Sunday: { Breakfast: null, Lunch: null, Dinner: null }
};

export const RecipeProvider = ({ children }) => {
  // Navigation State (custom SPA routing)
  const [currentPage, setCurrentPage] = useState('home');
  const [activeRecipeId, setActiveRecipeId] = useState(null);

  // Vibe Theme State ('spicy' or 'healthy')
  const [vibeTheme, setVibeTheme] = useState(() => {
    const saved = localStorage.getItem('spicyfy_vibe_theme');
    return saved ? saved : 'spicy';
  });

  // Core App States (with LocalStorage persistence)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('spicyfy_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [customRecipes, setCustomRecipes] = useState(() => {
    const saved = localStorage.getItem('spicyfy_custom_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealPlanner, setMealPlanner] = useState(() => {
    const saved = localStorage.getItem('spicyfy_meal_planner');
    return saved ? JSON.parse(saved) : defaultPlanner;
  });

  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    const saved = localStorage.getItem('spicyfy_checked_ingredients');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('spicyfy_reviews');
    return saved ? JSON.parse(saved) : {};
  });

  // Web Audio synthesizer for sizzling grill sound
  const playSizzle = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.45; // 0.45 seconds
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 2.0;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noise.start();
      setTimeout(() => noise.stop(), 500);
    } catch (e) {
      console.warn('AudioContext sizzling sound blocked:', e);
    }
  };

  // Web Audio synthesizer for healthy breeze wind chimes
  const playHealthyBreeze = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playChime = (freq, delay, duration) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + delay + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playChime(523.25, 0, 0.4);      // C5
      playChime(659.25, 0.08, 0.4);   // E5
      playChime(783.99, 0.16, 0.5);   // G5
      playChime(1046.50, 0.24, 0.6);  // C6
    } catch (e) {
      console.warn('AudioContext breeze sound blocked:', e);
    }
  };

  // Web Audio synthesizer for kitchen order chime bell
  const playKitchenBell = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2600, audioCtx.currentTime); // metal chime sound
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      setTimeout(() => osc.stop(), 250);
    } catch (e) {
      console.warn('AudioContext bell sound blocked:', e);
    }
  };

  const toggleVibeTheme = () => {
    setVibeTheme(prev => {
      const next = prev === 'spicy' ? 'healthy' : 'spicy';
      setTimeout(() => {
        if (next === 'spicy') {
          playSizzle();
        } else {
          playHealthyBreeze();
        }
      }, 50);
      return next;
    });
  };

  // Sync state to local storage when state changes
  useEffect(() => {
    localStorage.setItem('spicyfy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('spicyfy_custom_recipes', JSON.stringify(customRecipes));
  }, [customRecipes]);

  useEffect(() => {
    localStorage.setItem('spicyfy_meal_planner', JSON.stringify(mealPlanner));
  }, [mealPlanner]);

  useEffect(() => {
    localStorage.setItem('spicyfy_checked_ingredients', JSON.stringify(checkedIngredients));
  }, [checkedIngredients]);

  useEffect(() => {
    localStorage.setItem('spicyfy_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('spicyfy_vibe_theme', vibeTheme);
    
    // Apply body theme class and dynamic favicon (sprout for healthy, fire for spicy)
    const faviconLink = document.querySelector("link[rel*='icon']");
    if (vibeTheme === 'healthy') {
      document.body.classList.add('theme-healthy');
      document.body.classList.remove('theme-spicy');
      if (faviconLink) {
        faviconLink.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>";
      }
    } else {
      document.body.classList.add('theme-spicy');
      document.body.classList.remove('theme-healthy');
      if (faviconLink) {
        faviconLink.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>";
      }
    }
  }, [vibeTheme]);

  // Page switcher
  const setPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inspect recipe details
  const viewRecipe = (id) => {
    setActiveRecipeId(id);
    setPage('recipe-detail');
  };

  // Toggle Favorites
  const toggleFavorite = (recipe) => {
    const recipeId = recipe.idMeal || recipe.id;
    const isFav = favorites.some(fav => (fav.idMeal || fav.id) === recipeId);

    playKitchenBell(); // Satisfying bell chime when toggled!

    if (isFav) {
      setFavorites(prev => prev.filter(fav => (fav.idMeal || fav.id) !== recipeId));
    } else {
      const favObj = {
        idMeal: recipeId,
        strMeal: recipe.strMeal || recipe.name,
        strMealThumb: recipe.strMealThumb || recipe.image,
        strCategory: recipe.strCategory || recipe.category,
        strArea: recipe.strArea || recipe.area,
        isCustom: !!recipe.isCustom
      };
      setFavorites(prev => [...prev, favObj]);
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => (fav.idMeal || fav.id) === recipeId);
  };

  // Create User Custom Recipe
  const addCustomRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      idMeal: `custom-${Date.now()}`,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    setCustomRecipes(prev => [newRecipe, ...prev]);
    return newRecipe;
  };

  // Delete User Custom Recipe
  const deleteCustomRecipe = (recipeId) => {
    setCustomRecipes(prev => prev.filter(r => (r.idMeal || r.id) !== recipeId));
    setFavorites(prev => prev.filter(fav => (fav.idMeal || fav.id) !== recipeId));
    setMealPlanner(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(day => {
        Object.keys(copy[day]).forEach(mealType => {
          const meal = copy[day][mealType];
          if (meal && (meal.idMeal === recipeId || meal.id === recipeId)) {
            copy[day][mealType] = null;
          }
        });
      });
      return copy;
    });
  };

  // Meal Planner Operations
  const addMealToPlanner = (day, mealType, recipe) => {
    playKitchenBell(); // Satisfying bell chime when scheduling!
    setMealPlanner(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          idMeal: recipe.idMeal || recipe.id,
          strMeal: recipe.strMeal || recipe.name,
          strMealThumb: recipe.strMealThumb || recipe.image,
          ingredients: recipe.ingredients || null,
          isCustom: !!recipe.isCustom
        }
      }
    }));
  };

  const removeMealFromPlanner = (day, mealType) => {
    setMealPlanner(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null
      }
    }));
  };

  const clearPlanner = () => {
    setMealPlanner(defaultPlanner);
    setCheckedIngredients([]);
  };

  // Grocery Checklist Operations
  const toggleIngredientChecked = (ingName) => {
    setCheckedIngredients(prev => {
      const lower = ingName.toLowerCase().trim();
      if (prev.includes(lower)) {
        return prev.filter(i => i !== lower);
      } else {
        return [...prev, lower];
      }
    });
  };

  const clearCheckedIngredients = () => {
    setCheckedIngredients([]);
  };

  // Recipe Reviews Operations
  const addReview = (recipeId, rating, comment, userName = 'Guest Foodie') => {
    const newReview = {
      id: `rev-${Date.now()}`,
      userName,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    setReviews(prev => {
      const recipeReviews = prev[recipeId] || [];
      return {
        ...prev,
        [recipeId]: [newReview, ...recipeReviews]
      };
    });
  };

  return (
    <RecipeContext.Provider
      value={{
        currentPage,
        setPage,
        activeRecipeId,
        viewRecipe,
        favorites,
        toggleFavorite,
        isFavorite,
        customRecipes,
        addCustomRecipe,
        deleteCustomRecipe,
        mealPlanner,
        addMealToPlanner,
        removeMealFromPlanner,
        clearPlanner,
        checkedIngredients,
        toggleIngredientChecked,
        clearCheckedIngredients,
        reviews,
        addReview,
        vibeTheme,
        toggleVibeTheme,
        playSizzle,
        playHealthyBreeze,
        playKitchenBell
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
