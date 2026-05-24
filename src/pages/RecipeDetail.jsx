import React, { useState, useEffect, useContext, useRef } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const RecipeDetail = () => {
  const {
    activeRecipeId,
    setPage,
    toggleFavorite,
    isFavorite,
    customRecipes,
    deleteCustomRecipe,
    reviews,
    addReview,
    toggleIngredientChecked,
    checkedIngredients,
    playKitchenBell,
    vibeTheme
  } = useContext(RecipeContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Servings state
  const [servings, setServings] = useState(4); // Default base serving size is 4

  // Cooking Timer state
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Review states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  // Local prep checked states
  const [localChecked, setLocalChecked] = useState([]);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!activeRecipeId) return;
      setLoading(true);

      // Check if it's a custom recipe first
      if (activeRecipeId.toString().startsWith('custom-')) {
        const custom = customRecipes.find(r => (r.idMeal || r.id) === activeRecipeId);
        setRecipe(custom || null);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${activeRecipeId}`);
        const data = await res.json();
        const meal = data.meals?.[0];
        
        if (meal) {
          // Parse ingredients into array
          const parsedIngredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingName = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingName && ingName.trim() !== '') {
              parsedIngredients.push({
                name: ingName.trim(),
                measure: measure ? measure.trim() : ''
              });
            }
          }

          setRecipe({
            ...meal,
            ingredients: parsedIngredients
          });
        } else {
          setRecipe(null);
        }
      } catch (err) {
        console.error('Error loading recipe details:', err);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [activeRecipeId, customRecipes]);

  // Countdown timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            clearInterval(timerRef.current);
            playTimerChime();
            setTimeout(() => {
              alert('⏰ Spicy-Fy Cooking Timer Complete! Your dish is ready! 🍳');
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timerActive, timeRemaining]);

  // Web Audio chime generator
  const playTimerChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Play a happy two-tone culinary chime
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc1.start();
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1174.66, audioCtx.currentTime); // D6 note
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        setTimeout(() => osc2.stop(), 550);
      }, 180);
      
      setTimeout(() => osc1.stop(), 350);
    } catch (e) {
      console.warn('AudioContext chime error:', e);
    }
  };

  if (loading) {
    return (
      <div className="page-container detail-page-loading">
        <div className="loader" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page-container detail-page-error">
        <div className="error-panel glass-panel animate-pulse">
          <h3>Recipe Not Found</h3>
          <p>We couldn't retrieve this recipe details. It may have been deleted.</p>
          <button onClick={() => setPage('home')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const recipeId = recipe.idMeal || recipe.id;
  const isFav = isFavorite(recipeId);
  const recipeReviews = reviews[recipeId] || [];

  // Parse Youtube Link for iframe embedding
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const youtubeEmbedUrl = getYoutubeEmbed(recipe.strYoutube);

  // Toggle local prep checked status
  const handleTogglePrepItem = (ingName) => {
    const key = ingName.toLowerCase().trim();
    if (localChecked.includes(key)) {
      setLocalChecked(prev => prev.filter(k => k !== key));
    } else {
      setLocalChecked(prev => [...prev, key]);
    }
  };

  // Submit a review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please write a comment!');
      return;
    }

    addReview(recipeId, rating, comment.trim(), reviewerName.trim() || undefined);
    setComment('');
    setReviewerName('');
    setRating(5);
  };

  // Add all ingredients to shopping checklist (RecipeContext)
  const handleAddAllToShoppingList = () => {
    recipe.ingredients.forEach(ing => {
      const name = ing.name || ing.ingredient || '';
      if (name) {
        const key = name.toLowerCase().trim();
        if (!checkedIngredients.includes(key)) {
          toggleIngredientChecked(name);
        }
      }
    });
    alert('Added ingredients to your weekly shopping checklist!');
  };

  const handleDeleteRecipe = () => {
    if (confirm('Are you sure you want to delete this recipe from your cookbook?')) {
      deleteCustomRecipe(recipeId);
      setPage('home');
    }
  };

  // Measurement scaler calculation
  const scaleMeasurement = (measureStr, currentServings) => {
    if (!measureStr) return '';
    
    const ratio = currentServings / 4; // base recipe servings is 4
    
    const formatDecimal = (num) => {
      if (num % 1 === 0) return num.toString();
      const frac = num % 1;
      const intPart = Math.floor(num);
      const intStr = intPart > 0 ? `${intPart} ` : '';
      
      if (Math.abs(frac - 0.5) < 0.05) return `${intStr}1/2`;
      if (Math.abs(frac - 0.25) < 0.05) return `${intStr}1/4`;
      if (Math.abs(frac - 0.75) < 0.05) return `${intStr}3/4`;
      if (Math.abs(frac - 0.33) < 0.05) return `${intStr}1/3`;
      if (Math.abs(frac - 0.66) < 0.05) return `${intStr}2/3`;
      
      return num.toFixed(1).replace(/\.0$/, '');
    };
    
    const mixedFracRegex = /^(\d+)\s+(\d+)\/(\d+)(.*)$/;
    const simpleFracRegex = /^(\d+)\/(\d+)(.*)$/;
    const decimalRegex = /^(\d+(?:\.\d+)?)(.*)$/;
    
    let val = 0;
    let rest = '';
    
    if (mixedFracRegex.test(measureStr)) {
      const match = measureStr.match(mixedFracRegex);
      const whole = parseInt(match[1]);
      const num = parseInt(match[2]);
      const den = parseInt(match[3]);
      val = whole + (num / den);
      rest = match[4];
    } else if (simpleFracRegex.test(measureStr)) {
      const match = measureStr.match(simpleFracRegex);
      const num = parseInt(match[1]);
      const den = parseInt(match[2]);
      val = num / den;
      rest = match[3];
    } else if (decimalRegex.test(measureStr)) {
      const match = measureStr.match(decimalRegex);
      val = parseFloat(match[1]);
      rest = match[2];
    } else {
      return measureStr;
    }
    
    const scaledVal = val * ratio;
    return `${formatDecimal(scaledVal)}${rest}`;
  };

  // Timer helper utilities
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startTimer = () => { playKitchenBell(); setTimerActive(true); };
  const pauseTimer = () => { playKitchenBell(); setTimerActive(false); };
  const resetTimer = () => {
    playKitchenBell();
    setTimerActive(false);
    setTimeRemaining(timerDuration);
  };

  const setTimerPreset = (secs) => {
    playKitchenBell();
    setTimerActive(false);
    setTimerDuration(secs);
    setTimeRemaining(secs);
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const slideUpItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      className="page-container detail-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background decorations */}
      <div className="detail-bg-decorations">
        <motion.img 
          src={vibeTheme === 'healthy' ? '/salad-cutout.png' : '/burger-cutout.png'} 
          alt="Decoration" 
          className="detail-bg-food-image"
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
      </div>

      {/* Detail Toolbar */}
      <div className="detail-toolbar animate-fade-in">
        <button onClick={() => setPage('home')} className="btn-secondary back-btn">
          <i className="bi bi-arrow-left"></i> Back to Search
        </button>

        <div className="toolbar-actions">
          {recipe.isCustom && (
            <button onClick={handleDeleteRecipe} className="btn-secondary delete-recipe-btn" title="Delete recipe">
              <i className="bi bi-trash3"></i> Delete Recipe
            </button>
          )}
          <button
            onClick={() => toggleFavorite(recipe)}
            className={`btn-primary fav-detail-btn ${isFav ? 'active' : ''}`}
          >
            <i className={isFav ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            {isFav ? 'Favorited' : 'Save to Favorites'}
          </button>
        </div>
      </div>

      {/* Main Recipe Detail Grid */}
      <motion.div 
        className="detail-card glass-panel"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Hero Media Split Header Section */}
        <motion.div 
          className={`recipe-media-header ${youtubeEmbedUrl ? 'split-media' : 'single-media'}`} 
          variants={slideUpItem}
        >
          {/* Left Side: Food Image with overlayed title */}
          <div className="recipe-hero-image-wrapper">
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-hero-image" />
            <div className="recipe-hero-overlay" />
            
            {/* Animated Floating Vibe Indicator Badge */}
            <div className="recipe-hero-vibe-badge">
              <span className={`vibe-glow-text theme-${vibeTheme}`}>
                {vibeTheme === 'spicy' ? '🌶️ Hot & Spicy Pick' : '🌿 Fresh & Wholesome'}
              </span>
            </div>

            <div className="recipe-hero-title-box">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                {recipe.strMeal}
              </motion.h1>
              <div className="recipe-badges">
                {recipe.strCategory && <span className="badge">📂 {recipe.strCategory}</span>}
                {recipe.strArea && <span className="badge">🌍 {recipe.strArea}</span>}
                {recipe.isCustom && <span className="badge custom-tag">✍️ Custom Cookbook</span>}
              </div>
            </div>
          </div>

          {/* Right Side: YouTube Video (Only if it exists) */}
          {youtubeEmbedUrl && (
            <div className="recipe-video-wrapper">
              <iframe
                title="Video Tutorial"
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="recipe-hero-video-frame"
              />
            </div>
          )}
        </motion.div>

        {/* Dynamic Cook Companion Panel (Servings & Timer side-by-side) */}
        <motion.div className="cooking-companion-panel glass-panel" variants={slideUpItem}>
          {/* Servings Adjuster */}
          <div className="companion-block servings-adjuster-block">
            <h3><i className="bi bi-people"></i> Scalable Servings</h3>
            <p className="block-tagline">Recalculate ingredient volumes dynamically:</p>
            <div className="servings-controls">
              <button 
                onClick={() => { playKitchenBell(); setServings(s => Math.max(1, s - 1)); }}
                className="serving-btn"
                disabled={servings <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="serving-count-display">{servings}</span>
              <button 
                onClick={() => { playKitchenBell(); setServings(s => Math.min(20, s + 1)); }}
                className="serving-btn"
              >
                <i className="bi bi-plus"></i>
              </button>
              <span className="serving-base-indicator">(Default: 4)</span>
            </div>
          </div>

          <div className="vertical-divider" />

          {/* Interactive Timer */}
          <div className="companion-block timer-block">
            <h3><i className="bi bi-stopwatch"></i> Cooking Stopwatch</h3>
            <p className="block-tagline">Track boiling and baking times:</p>
            <div className="timer-interface">
              <div className="timer-countdown">{formatTime(timeRemaining)}</div>
              
              <div className="timer-buttons">
                {timerActive ? (
                  <button onClick={pauseTimer} className="timer-control-btn pause">
                    <i className="bi bi-pause-fill"></i> Pause
                  </button>
                ) : (
                  <button onClick={startTimer} className="timer-control-btn start">
                    <i className="bi bi-play-fill"></i> Start
                  </button>
                )}
                <button onClick={resetTimer} className="timer-control-btn reset">
                  <i className="bi bi-arrow-counterclockwise"></i> Reset
                </button>
              </div>

              {/* Quick Setting Presets */}
              <div className="timer-presets">
                <button onClick={() => setTimerPreset(60)} className="preset-btn">1m</button>
                <button onClick={() => setTimerPreset(300)} className="preset-btn">5m</button>
                <button onClick={() => setTimerPreset(600)} className="preset-btn">10m</button>
                <button onClick={() => setTimerPreset(900)} className="preset-btn">15m</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content columns */}
        <div className="recipe-content-grid">
          {/* Ingredients Column */}
          <motion.div className="recipe-ingredients-col" variants={slideUpItem}>
            <div className="column-header">
              <h2>🥘 Ingredients</h2>
              <button
                type="button"
                onClick={handleAddAllToShoppingList}
                className="btn-secondary add-all-shopping-btn"
              >
                <i className="bi bi-plus"></i> Add to Grocery List
              </button>
            </div>

            <p className="checklist-helper">Check off items as you gather them in the kitchen:</p>

            <table className="ingredients-table-detail">
              <thead>
                <tr>
                  <th className="th-check">Ready</th>
                  <th>Ingredient</th>
                  <th className="th-qty">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients && recipe.ingredients.map((ing, idx) => {
                  const name = ing.name || ing.ingredient;
                  const key = name.toLowerCase().trim();
                  const isChecked = localChecked.includes(key);

                  return (
                    <tr
                      key={idx}
                      onClick={() => handleTogglePrepItem(name)}
                      className={`prep-item-row ${isChecked ? 'active-checked' : ''}`}
                    >
                      <td className="td-check">
                        <div className={`detail-checkbox ${isChecked ? 'active' : ''}`}>
                          {isChecked && <i className="bi bi-check-lg"></i>}
                        </div>
                      </td>
                      <td className="td-name">{name}</td>
                      <td className="td-qty">{scaleMeasurement(ing.measure, servings)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          {/* Instructions Column */}
          <motion.div className="recipe-instructions-col" variants={slideUpItem}>
            <h2>📝 Cooking Instructions</h2>
            <div className="instructions-body">
              {recipe.strInstructions.split('\r\n').filter(p => p.trim() !== '').map((para, idx) => (
                <div key={idx} className="instruction-step-card glass-panel">
                  <div className="step-number">{idx + 1}</div>
                  <p className="instruction-paragraph">{para}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>


      </motion.div>

      {/* Review Comments Feedback Board */}
      <motion.div className="reviews-section glass-panel" initial={{ opacity: 0 }} whileInView={{ opacity: 1, transition: { duration: 0.5 } }} viewport={{ once: true }}>
        <div className="reviews-header">
          <h2><i className="bi bi-chat-right-text reviews-title-icon"></i> Foodie Reviews ({recipeReviews.length})</h2>
        </div>

        <div className="reviews-layout">
          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write a Review</h3>
            
            <div className="form-group">
              <label className="form-label">Your Name (Optional)</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Master Chef Jane"
                className="form-input"
              />
            </div>

            {/* Stars rating selection */}
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileTap={{ scale: 0.8 }}
                    className="star-btn"
                  >
                    <i
                      className={`bi bi-star${(hoverRating || rating) >= star ? '-fill' : ''} rating-star-icon`}
                      style={{
                        color: (hoverRating || rating) >= star ? '#f9d423' : '#94a3b8',
                        fontSize: '1.5rem'
                      }}
                    ></i>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Review Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your culinary thoughts, seasoning suggestions, or recipe adjustments..."
                rows={4}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary submit-review-btn">
              Post Review
            </button>
          </form>

          {/* List of Reviews */}
          <div className="reviews-list-container">
            {recipeReviews.length > 0 ? (
              <div className="reviews-feed">
                {recipeReviews.map(rev => (
                  <div key={rev.id} className="review-card-item glass-panel">
                    <div className="review-card-header">
                      <div className="reviewer-avatar">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-details">
                        <span className="reviewer-name">{rev.userName}</span>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="reviewer-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                          <i
                            key={s}
                            className={`bi bi-star${rev.rating >= s ? '-fill' : ''}`}
                            style={{ color: rev.rating >= s ? '#f9d423' : '#e2e8f0', fontSize: '0.85rem' }}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <p className="reviewer-comment">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews-feed">
                <p>No reviews have been written for this recipe yet. Be the first to share your rating!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .detail-page {
          max-width: 1200px;
          position: relative;
        }

        .detail-bg-decorations {
          position: fixed;
          bottom: 4%;
          left: -40px;
          width: 180px;
          height: auto;
          pointer-events: none;
          z-index: 0;
          opacity: 0.12;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.06));
        }

        .detail-bg-food-image {
          width: 100%;
          height: auto;
        }

        .detail-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .toolbar-actions {
          display: flex;
          gap: 0.75rem;
        }

        .fav-detail-btn {
          gap: 8px;
        }

        .fav-detail-btn i {
          font-size: 1.1rem;
        }

        .fav-detail-btn.active {
          background: var(--accent-red);
          box-shadow: 0 0 15px var(--accent-red-glow);
        }

        .delete-recipe-btn:hover {
          color: var(--accent-red);
          border-color: var(--accent-red);
          background: rgba(239, 68, 68, 0.05);
        }

        .detail-card {
          overflow: hidden;
          border-radius: var(--border-radius-lg);
          margin-bottom: 3rem;
          background: var(--bg-secondary);
        }

        /* Hero Media Header (Image + Video 50/50 Split) */
        .recipe-media-header {
          display: grid;
          width: 100%;
          background: #000;
          overflow: hidden;
          position: relative;
        }

        .recipe-media-header.split-media {
          grid-template-columns: 1fr 1fr;
          height: 400px;
        }

        /* Pulsing glowing middle divider in split-media layout */
        .recipe-media-header.split-media::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--accent), transparent);
          box-shadow: 0 0 15px var(--accent);
          z-index: 10;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .recipe-media-header.single-media {
          grid-template-columns: 1fr;
          height: 380px;
        }

        .recipe-hero-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
        }

        .recipe-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 6s cubic-bezier(0.1, 1, 0.1, 1);
        }

        .recipe-hero-image-wrapper:hover .recipe-hero-image {
          transform: scale(1.08) rotate(0.5deg);
        }

        .recipe-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.2) 60%, rgba(0,0,0,0) 100%);
          z-index: 1;
        }

        .recipe-media-header.split-media .recipe-hero-overlay {
          background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(0,0,0,0.1) 100%),
                      linear-gradient(to right, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%);
        }

        .recipe-hero-title-box {
          position: absolute;
          bottom: 2rem;
          left: 2.5rem;
          right: 2.5rem;
          z-index: 2;
        }

        .recipe-hero-title-box h1 {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 10px rgba(255,255,255,0.5);
        }

        /* Floating Vibe Indicator Badge */
        .recipe-hero-vibe-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 50px;
          z-index: 10;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vibe-glow-text.theme-spicy {
          color: #ff5e3a;
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        }

        .vibe-glow-text.theme-healthy {
          color: #34d399;
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }

        .recipe-video-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          transition: var(--transition-smooth);
        }

        /* Cook Along Glow Overlay */
        .recipe-video-wrapper::before {
          content: 'COOK ALONG TUTORIAL';
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: var(--accent);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          z-index: 10;
          box-shadow: 0 0 15px var(--accent-glow);
          pointer-events: none;
          opacity: 0.85;
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0% { opacity: 0.65; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 0.65; transform: scale(0.97); }
        }

        .recipe-hero-video-frame {
          width: 100%;
          height: 100%;
          border: none;
        }

        .recipe-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .recipe-badges .badge {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .recipe-badges .badge.custom-tag {
          background: rgba(239, 68, 68, 0.08);
          border-color: var(--accent-red);
          color: var(--accent-red);
        }

        /* Companion Panel (Servings & Timer) */
        .cooking-companion-panel {
          display: flex;
          margin: 2rem 2.5rem 0;
          padding: 1.75rem;
          border-radius: var(--border-radius-md);
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
          gap: 2rem;
        }

        .companion-block {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .companion-block h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0.25rem;
        }

        .block-tagline {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .vertical-divider {
          width: 1px;
          background: var(--glass-border);
          align-self: stretch;
        }

        /* Servings controls */
        .servings-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .serving-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: white;
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .serving-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(16, 185, 129, 0.05);
        }

        .serving-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .serving-count-display {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: var(--font-family-header) !important;
          color: var(--accent-red);
          min-width: 30px;
          text-align: center;
        }

        .serving-base-indicator {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Timer controls */
        .timer-interface {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .timer-countdown {
          font-size: 2.2rem;
          font-weight: 800;
          font-family: var(--font-family-header) !important;
          color: var(--accent);
          background: white;
          padding: 4px 20px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--glass-border);
          min-width: 110px;
          text-align: center;
          letter-spacing: 1px;
        }

        .timer-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .timer-control-btn {
          padding: 8px 16px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: var(--transition-smooth);
        }

        .timer-control-btn.start {
          background: var(--accent);
          color: white;
        }

        .timer-control-btn.pause {
          background: var(--accent-red);
          color: white;
        }

        .timer-control-btn.reset {
          background: rgba(0,0,0,0.05);
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
        }

        .timer-control-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .timer-presets {
          display: flex;
          gap: 0.4rem;
        }

        .preset-btn {
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          background: white;
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .preset-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Layout Grid */
        .recipe-content-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3.5rem;
          padding: 2.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .recipe-content-grid h2 {
          font-size: 1.4rem;
          color: var(--text-primary);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .add-all-shopping-btn {
          padding: 6px 14px;
          font-size: 0.82rem;
          gap: 4px;
        }

        .checklist-helper {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          font-weight: 500;
        }

        /* Ingredients detail table */
        .ingredients-table-detail {
          width: 100%;
          border-collapse: collapse;
          background: rgba(0,0,0,0.01);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .ingredients-table-detail th {
          background: rgba(0,0,0,0.02);
          border-bottom: 1px solid var(--glass-border);
          padding: 12px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-align: left;
        }

        .ingredients-table-detail th.th-check {
          text-align: center;
          width: 60px;
        }

        .ingredients-table-detail th.th-qty {
          width: 120px;
        }

        .prep-item-row {
          border-bottom: 1px solid rgba(0,0,0,0.03);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .prep-item-row:last-child {
          border-bottom: none;
        }

        .prep-item-row:hover {
          background: rgba(0,0,0,0.02);
        }

        .prep-item-row.active-checked {
          background: rgba(16, 185, 129, 0.02);
          opacity: 0.6;
        }

        .prep-item-row.active-checked .td-name {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .prep-item-row.active-checked .td-qty {
          color: var(--text-muted);
        }

        .td-check {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px;
        }

        .detail-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: var(--transition-smooth);
          font-size: 0.72rem;
        }

        .detail-checkbox.active {
          background: var(--accent);
          border-color: transparent;
        }

        .ingredients-table-detail td {
          padding: 12px 16px;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .td-name {
          font-weight: 600;
          text-transform: capitalize;
        }

        .td-qty {
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Instructions list */
        .instructions-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .instruction-step-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.25rem;
          border-radius: var(--border-radius-md);
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          font-family: var(--font-family-header) !important;
          font-weight: bold;
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px var(--accent-glow);
        }

        .instruction-paragraph {
          line-height: 1.7;
          color: var(--text-secondary);
          font-size: 0.96rem;
          text-align: justify;
          font-weight: 500;
        }



        /* Reviews Board styling */
        .reviews-section {
          padding: 2.5rem;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .reviews-header {
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }

        .reviews-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.4rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .reviews-title-icon {
          color: var(--accent-red);
        }

        .reviews-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
        }

        .review-form h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          font-weight: 700;
        }

        .star-rating-selector {
          display: flex;
          gap: 6px;
          padding: 4px 0;
        }

        .star-btn {
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .submit-review-btn {
          padding: 10px 24px;
          font-size: 0.9rem;
        }

        .reviews-list-container {
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .reviews-feed {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-card-item {
          padding: 1.25rem;
          border-radius: var(--border-radius-md);
          background: var(--bg-primary);
        }

        .review-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 0.75rem;
        }

        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .reviewer-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .reviewer-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .review-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 1px;
          font-weight: 500;
        }

        .reviewer-stars {
          display: flex;
          gap: 2px;
        }

        .reviewer-comment {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .no-reviews-feed {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }

        @media (max-width: 992px) {
          .cooking-companion-panel {
            flex-direction: column;
            margin: 1.5rem 1.5rem 0;
            padding: 1.25rem;
            gap: 1.5rem;
          }
          .vertical-divider {
            height: 1px;
            width: 100%;
          }
          .recipe-content-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .reviews-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .recipe-media-header.split-media {
            grid-template-columns: 1fr;
            height: auto;
          }
          .recipe-hero-image-wrapper, .recipe-video-wrapper {
            height: 280px;
          }
          .recipe-media-header.single-media {
            height: 250px;
          }
          .recipe-hero-title-box {
            left: 1.5rem;
            right: 1.5rem;
            bottom: 1.5rem;
          }
          .recipe-hero-title-box h1 {
            font-size: 1.8rem;
          }
          .recipe-content-grid {
            padding: 1.5rem;
          }
          .reviews-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
