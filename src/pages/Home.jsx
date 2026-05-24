import React, { useState, useEffect, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { MealCard } from '../components/MealCard';
import { motion, AnimatePresence } from 'framer-motion';
import { BreakfastIcon, DessertIcon, VegetarianIcon, SeafoodIcon, PastaIcon, ChickenIcon } from '../components/CategoryIcons';

const FloatingParticles = ({ theme }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const items = theme === 'spicy' 
      ? ['🌶️', '🔥', '🍅', '✨'] 
      : ['🌱', '🥬', '🥑', '🥦', '✨'];
      
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: items[Math.floor(Math.random() * items.length)],
      x: Math.random() * 100, // percentage width
      size: Math.random() * 1.2 + 0.6, // rem size
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 8 // seconds
    }));
    setParticles(newParticles);
  }, [theme]);
  
  return (
    <div className="floating-particles-container">
      {particles.map(p => (
        <motion.span
          key={`${theme}-${p.id}`}
          className="floating-particle"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}rem`,
          }}
          initial={{ y: '105vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.7, 0.7, 0] 
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

export const Home = () => {
  const { customRecipes, viewRecipe, vibeTheme, playSizzle, playHealthyBreeze, playKitchenBell } = useContext(RecipeContext);
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mouse Coordinate Tilt State for Burger
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  // Food Click Spin State
  const [isSpinning, setIsSpinning] = useState(false);

  const handleFoodClick = () => {
    setIsSpinning(true);
    if (vibeTheme === 'spicy') {
      playSizzle();
    } else {
      playHealthyBreeze();
    }
    setTimeout(() => setIsSpinning(false), 800);
  };

  // Emoji Burst Exploder State
  const [emojiBursts, setEmojiBursts] = useState([]);

  // Meal Decider Quiz State
  const [deciderStep, setDeciderStep] = useState(0); // 0 = start, 1 = vibe, 2 = time, 3 = result
  const [deciderVibe, setDeciderVibe] = useState(''); // 'spicy' or 'healthy'
  const [deciderTime, setDeciderTime] = useState(''); // 'quick' or 'leisurely'
  const [deciderResult, setDeciderResult] = useState(null);
  const [deciderLoading, setDeciderLoading] = useState(false);

  // Carousel Trending Recipes
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const categories = [
    { name: 'Breakfast', icon: BreakfastIcon },
    { name: 'Dessert', icon: DessertIcon },
    { name: 'Vegetarian', icon: VegetarianIcon },
    { name: 'Seafood', icon: SeafoodIcon },
    { name: 'Pasta', icon: PastaIcon },
    { name: 'Chicken', icon: ChickenIcon }
  ];

  // Fetch trending recipes on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
        const data = await res.json();
        if (data.meals) {
          setTrendingRecipes(data.meals.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching trending:', err);
      }
    };
    fetchTrending();
  }, []);

  // Handle mouse movement for parallax image
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (clientY - top) / height - 0.5;
    setMouseCoords({ x, y });
  };

  // Trigger Exploding Emojis
  const triggerEmojiBurst = (e) => {
    const clickX = e.clientX || window.innerWidth / 2;
    const clickY = e.clientY || window.innerHeight / 2;
    
    const emojiPool = vibeTheme === 'spicy' 
      ? ['🌶️', '🔥', '🍅', '🍔', '🍳', '🍗'] 
      : ['🥗', '🥬', '🥦', '🥑', '🍳', '🦐'];
      
    const newBursts = [];
    for (let i = 0; i < 8; i++) {
      newBursts.push({
        id: `burst-${Date.now()}-${Math.random()}`,
        x: clickX,
        y: clickY,
        emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)]
      });
    }
    setEmojiBursts(prev => [...prev, ...newBursts]);
    
    // Clear elements
    setTimeout(() => {
      setEmojiBursts(prev => prev.filter(b => !newBursts.includes(b)));
    }, 900);
  };

  const handleSearchClick = (e) => {
    playSizzle();
    triggerEmojiBurst(e);
    handleSearch();
  };

  const handleSearch = async (searchQuery) => {
    const activeQuery = searchQuery || query;
    if (!activeQuery.trim()) {
      alert('Please type something!');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setMeals([]);

    try {
      const lowerQuery = activeQuery.toLowerCase().trim();

      // Find custom recipes matching search
      const customMatches = customRecipes.filter(recipe => {
        const title = (recipe.strMeal || recipe.name || '').toLowerCase();
        const cat = (recipe.strCategory || recipe.category || '').toLowerCase();
        const area = (recipe.strArea || recipe.area || '').toLowerCase();
        return title.includes(lowerQuery) || cat.includes(lowerQuery) || area.includes(lowerQuery);
      });

      let apiMeals = [];

      // 1. Fetch by Name
      const nameRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${activeQuery}`);
      const nameData = await nameRes.json();
      if (nameData.meals) apiMeals = [...nameData.meals];

      // 2. If results are light, try by Category
      if (apiMeals.length < 5) {
        const catRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${activeQuery}`);
        const catData = await catRes.json();
        if (catData.meals) {
          const currentIds = apiMeals.map(m => m.idMeal);
          catData.meals.forEach(m => {
            if (!currentIds.includes(m.idMeal)) apiMeals.push(m);
          });
        }
      }

      // Combine custom and api recipes
      setMeals([...customMatches, ...apiMeals]);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      const lowerQuery = activeQuery.toLowerCase().trim();
      const customMatches = customRecipes.filter(recipe => 
        (recipe.strMeal || recipe.name || '').toLowerCase().includes(lowerQuery)
      );
      setMeals(customMatches);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      playSizzle();
      triggerEmojiBurst(e);
      handleSearch();
    }
  };

  const handleChipClick = (e, categoryName) => {
    playSizzle();
    triggerEmojiBurst(e);
    setQuery(categoryName);
    handleSearch(categoryName);
  };

  // Run the Meal Decider Quiz match
  const handleDeciderSubmit = async (vibe, time) => {
    setDeciderLoading(true);
    setDeciderStep(3);
    setDeciderResult(null);

    let searchTerms = [];
    if (vibe === 'spicy') {
      searchTerms = time === 'quick' ? ['mexican', 'pasta'] : ['indian', 'curry'];
    } else {
      searchTerms = time === 'quick' ? ['breakfast', 'seafood'] : ['vegetarian', 'vegan'];
    }

    const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`);
      const data = await res.json();
      let matches = data.meals || [];

      if (!matches.length) {
        const areaRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${term}`);
        const areaData = await areaRes.json();
        matches = areaData.meals || [];
      }

      if (matches.length > 0) {
        const randomMeal = matches[Math.floor(Math.random() * matches.length)];
        setDeciderResult(randomMeal);
        setTimeout(() => playKitchenBell(), 100); // success chime!
      } else {
        const resFallback = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=soup');
        const dataFallback = await resFallback.json();
        if (dataFallback.meals) {
          setDeciderResult(dataFallback.meals[Math.floor(Math.random() * dataFallback.meals.length)]);
          setTimeout(() => playKitchenBell(), 100);
        }
      }
    } catch (e) {
      console.error('Decider error:', e);
    } finally {
      setDeciderLoading(false);
    }
  };

  const handleDeciderOption = (e, type, value) => {
    playSizzle();
    triggerEmojiBurst(e);
    if (type === 'vibe') {
      setDeciderVibe(value);
      setDeciderStep(2);
    } else if (type === 'time') {
      setDeciderTime(value);
      handleDeciderSubmit(deciderVibe, value);
    }
  };

  const resetDecider = (e) => {
    playKitchenBell();
    triggerEmojiBurst(e);
    setDeciderStep(0);
    setDeciderVibe('');
    setDeciderTime('');
    setDeciderResult(null);
  };

  // Carousel handlers
  const prevCarousel = () => {
    playKitchenBell();
    setCarouselIndex(prev => (prev === 0 ? trendingRecipes.length - 1 : prev - 1));
  };

  const nextCarousel = () => {
    playKitchenBell();
    setCarouselIndex(prev => (prev === trendingRecipes.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      className="page-container home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gentle upward floating particles reacting to theme */}
      <FloatingParticles theme={vibeTheme} />

      {/* Interactive Hero Split Section with mouse tilt listener */}
      <section className="hero-section" onMouseMove={handleMouseMove}>
        {/* Left column */}
        <div className="hero-left">
          <motion.div
            className={`hero-badge theme-${vibeTheme}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <img 
              src={vibeTheme === 'spicy' ? '/chili-icon.png' : '/salad-icon.png'} 
              alt="Vibe" 
              className="badge-inline-icon"
            />
            {vibeTheme === 'spicy' ? 'Hot & Spicy Mode' : 'Fresh & Healthy Mode'}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Spicy-Fy
          </motion.h1>
          <motion.p
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover thousands of delicious, hot & healthy recipes from around the world
          </motion.p>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Search by name, cuisine, or meal type — your culinary journey starts here
          </motion.p>

          {/* Search bar inside hero */}
          <div className="search-section-hero">
            <div className="search-bar glass-panel">
              <i className="bi bi-search search-icon-svg"></i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Try 'Breakfast', 'Indian', or 'Chicken'..."
                className="search-input"
              />
              <button onClick={handleSearchClick} className="btn-primary search-btn">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Hero Interactive Image on Right (glowing gourmet square card) */}
        <div className="hero-right">
          <motion.div 
            className="hero-image-frame"
            style={{
              transform: `perspective(1000px) rotateX(${-mouseCoords.y * 15}deg) rotateY(${mouseCoords.x * 15}deg)`,
              background: `radial-gradient(circle at ${50 + mouseCoords.x * 60}% ${50 + mouseCoords.y * 60}%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 40%, rgba(255, 255, 255, 0.1) 100%)`
            }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
          >
            {/* Rich square photograph card, swaps on theme switch and wiggles/scales on click */}
            <motion.img 
              key={vibeTheme}
              src={vibeTheme === 'healthy' ? '/salad-square.png' : '/burger-square.png'} 
              alt="Gourmet Food Card" 
              className="hero-food-square"
              onClick={handleFoodClick}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isSpinning 
                ? { scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] } 
                : { scale: 1, opacity: 1 }
              }
              transition={isSpinning
                ? { duration: 0.6, ease: 'easeInOut' }
                : { scale: { type: 'spring', stiffness: 100, damping: 10 } }
              }
              whileHover={{ scale: 1.02 }}
            />

            <div className="image-accent-overlay" />
            
            {/* Floating badges */}
            <motion.div
              className="floating-badge green"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <img src="/salad-icon.png" alt="Salad Icon" className="badge-inline-icon" /> Healthy & Organic
            </motion.div>
            
            <motion.div
              className="floating-badge red"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
            >
              <img src="/chili-icon.png" alt="Chili Icon" className="badge-inline-icon" /> Hot & Spicy
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {!hasSearched && (
          <motion.div
            key="landing-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="landing-content"
          >
            {/* Popular Categories Chips */}
            <div className="popular-categories">
              <h2 className="section-title">🔥 Popular Categories</h2>
              <div className="category-chips">
                {categories.map((cat) => {
                  const IconComp = cat.icon;
                  return (
                    <motion.button
                      key={cat.name}
                      className="category-chip glass-panel"
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleChipClick(e, cat.name)}
                    >
                      {IconComp && <IconComp size={32} />} {cat.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Section 1: Culinary Decider Quiz */}
            <div className="decider-section glass-panel">
              <div className="decider-header">
                <h2><i className="bi bi-egg-fried decider-icon"></i> Meal Decider Quiz <img src="/dice-icon.png" alt="dice" className="header-inline-icon" /></h2>
                <p>Can't decide what to cook? Answer 2 quick questions to find your perfect recipe!</p>
              </div>

              <div className="decider-body">
                <AnimatePresence mode="wait">
                  {deciderStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="decider-quiz-step start-step"
                    >
                      <button onClick={() => setDeciderStep(1)} className="btn-primary start-quiz-btn">
                        <img src="/dice-icon.png" alt="Dice" className="btn-inline-icon" /> Roll the Culinary Dice
                      </button>
                    </motion.div>
                  )}

                  {deciderStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="decider-quiz-step"
                    >
                      <h3>1. Choose your culinary vibe:</h3>
                      <div className="decider-options-grid">
                        <button onClick={(e) => handleDeciderOption(e, 'vibe', 'spicy')} className="decider-option-card spicy">
                          <img src="/chili-icon.png" alt="Spicy Vibe" className="quiz-card-icon" />
                          <span className="title">Hot & Spicy</span>
                          <span className="desc">Bold flavors, exotic seasoning, and warming spices</span>
                        </button>
                        <button onClick={(e) => handleDeciderOption(e, 'vibe', 'healthy')} className="decider-option-card healthy">
                          <img src="/salad-icon.png" alt="Healthy Vibe" className="quiz-card-icon" />
                          <span className="title">Fresh & Healthy</span>
                          <span className="desc">Crisp greens, wholesome grains, and light ingredients</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {deciderStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="decider-quiz-step"
                    >
                      <h3>2. How much time do you have?</h3>
                      <div className="decider-options-grid">
                        <button onClick={(e) => handleDeciderOption(e, 'time', 'quick')} className="decider-option-card quick">
                          <img src="/lightning-icon.png" alt="Quick & Easy" className="quiz-card-icon" />
                          <span className="title">Quick & Easy</span>
                          <span className="desc">Ready in 30 minutes or less (simple breakfast, light pastas)</span>
                        </button>
                        <button onClick={(e) => handleDeciderOption(e, 'time', 'leisurely')} className="decider-option-card leisurely">
                          <img src="/chef-icon.png" alt="Leisurely & Gourmet" className="quiz-card-icon" />
                          <span className="title">Leisurely & Gourmet</span>
                          <span className="desc">Take your time cooking a rich, slow curry or premium dessert</span>
                        </button>
                      </div>
                      <button onClick={resetDecider} className="btn-secondary back-quiz-btn">Restart</button>
                    </motion.div>
                  )}

                  {deciderStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="decider-quiz-step result-step"
                    >
                      {deciderLoading ? (
                        <div className="loader" />
                      ) : deciderResult ? (
                        <div className="decider-result-box">
                          <h3>🎉 We found your perfect recipe!</h3>
                          
                          <div className="decider-result-card glass-panel" onClick={() => viewRecipe(deciderResult.idMeal)}>
                            <img src={deciderResult.strMealThumb} alt={deciderResult.strMeal} className="decider-result-thumb" />
                            <div className="decider-result-info">
                              <h4>{deciderResult.strMeal}</h4>
                              <p>Click to view complete ingredients and cooking directions.</p>
                              <button className="btn-primary view-decider-btn">
                                Open Recipe
                              </button>
                            </div>
                          </div>

                          <div className="decider-result-actions">
                            <button onClick={resetDecider} className="btn-secondary">
                              Roll Again 🎲
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="decider-error">
                          <p>Something went wrong matches. Try rolling again.</p>
                          <button onClick={resetDecider} className="btn-primary">Try Again</button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Section 2: Trending Recipes Carousel Slider */}
            {trendingRecipes.length > 0 && (
              <div className="trending-carousel-section glass-panel">
                <div className="carousel-header">
                  <h2><i className="bi bi-award-fill text-rose"></i> Trending Chef Choices</h2>
                  <p>Discover recipes highly rated by foodies this week:</p>
                </div>

                <div className="carousel-container">
                  <button onClick={prevCarousel} className="carousel-nav-btn prev" title="Previous">
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  <div className="carousel-slide-viewport">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        className="carousel-slide-card"
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => viewRecipe(trendingRecipes[carouselIndex].idMeal)}
                      >
                        <img 
                          src={trendingRecipes[carouselIndex].strMealThumb} 
                          alt={trendingRecipes[carouselIndex].strMeal} 
                          className="carousel-slide-image"
                        />
                        <div className="carousel-slide-overlay" />
                        <div className="carousel-slide-content">
                          <span className="carousel-slide-tag">✨ Trending No. {carouselIndex + 1}</span>
                          <h3>{trendingRecipes[carouselIndex].strMeal}</h3>
                          <p>📂 {trendingRecipes[carouselIndex].strCategory} • 🌍 {trendingRecipes[carouselIndex].strArea}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button onClick={nextCarousel} className="carousel-nav-btn next" title="Next">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="carousel-dots">
                  {trendingRecipes.map((_, idx) => (
                    <button 
                      key={idx} 
                      className={`carousel-dot ${carouselIndex === idx ? 'active' : ''}`}
                      onClick={() => setCarouselIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {hasSearched && (
          <motion.div
            key="results-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="results-content"
          >
            <div className="results-header">
              <h2>🔍 Search Results ({meals.length})</h2>
              <button
                className="btn-secondary"
                onClick={() => {
                  setHasSearched(false);
                  setQuery('');
                  setMeals([]);
                }}
              >
                Clear Search
              </button>
            </div>

            {loading ? (
              <div className="loader" />
            ) : meals.length > 0 ? (
              <motion.div
                className="meals-grid"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
              >
                {meals.map((meal) => (
                  <MealCard key={meal.idMeal || meal.id} recipe={meal} />
                ))}
              </motion.div>
            ) : (
              <div className="no-results-panel glass-panel">
                <span className="no-results-emoji">😢</span>
                <h3>No Recipes Found</h3>
                <p>We couldn't find matches for "{query}". Try checking your spelling or search a simple ingredient like "Rice".</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Container for exploding emojis */}
      <div className="emoji-overlay-container">
        {emojiBursts.map(burst => (
          <motion.span
            key={burst.id}
            initial={{ opacity: 1, scale: 0.6, x: burst.x - 12, y: burst.y - 12 }}
            animate={{ 
              opacity: 0, 
              scale: 1.6,
              x: burst.x + (Math.random() * 160 - 80), 
              y: burst.y - (Math.random() * 120 + 50) 
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="exploding-emoji"
          >
            {burst.emoji}
          </motion.span>
        ))}
      </div>

      <style>{`
        .home-page {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Hero Section Grid */
        .hero-section {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 4rem;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 5rem;
          align-items: center;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-badge {
          border: 1px solid var(--glass-border);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: var(--font-family-header) !important;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: var(--transition-smooth);
        }

        .hero-badge.theme-spicy {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        .hero-badge.theme-healthy {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }

        .hero-left h1 {
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -2px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          line-height: 1.1;
        }

        .tagline {
          font-size: 1.3rem;
          color: var(--text-secondary);
          max-width: 550px;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          font-weight: 600;
        }

        .subtitle {
          font-size: 0.98rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .search-section-hero {
          width: 100%;
          max-width: 550px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          padding: 6px 6px 6px 20px;
          border-radius: 100px;
          width: 100%;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: var(--transition-smooth);
        }

        .search-bar:focus-within {
          border-color: var(--accent);
          box-shadow: 0 10px 30px var(--accent-glow);
        }

        .search-icon-svg {
          color: var(--text-muted);
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 1.2rem;
        }

        .search-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          outline: none;
          font-size: 1.05rem;
          padding: 10px 0;
          width: 100%;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-btn {
          padding: 12px 32px;
          flex-shrink: 0;
        }

        /* Hero Right Image Frame */
        .hero-right {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .hero-image-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          aspect-ratio: 1;
          border-radius: var(--border-radius-lg);
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid var(--glass-border);
          box-shadow: var(--card-shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overflow: visible;
        }

        .hero-food-square {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .floating-particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .floating-particle {
          position: absolute;
          bottom: -50px;
          opacity: 0;
          pointer-events: none;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.06));
        }

        .quiz-card-icon {
          width: 72px;
          height: 72px;
          object-fit: contain;
          margin-bottom: 1rem;
          transition: var(--transition-elastic);
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.08));
        }

        .decider-option-card:hover .quiz-card-icon {
          transform: scale(1.15) rotate(5deg);
        }

        .badge-inline-icon {
          width: 18px;
          height: 18px;
          object-fit: contain;
          vertical-align: middle;
          margin-right: 6px;
        }

        .btn-inline-icon {
          width: 22px;
          height: 22px;
          object-fit: contain;
          vertical-align: middle;
          margin-right: 8px;
        }

        .header-inline-icon {
          width: 26px;
          height: 26px;
          object-fit: contain;
          vertical-align: middle;
          margin-left: 6px;
          display: inline-block;
        }

        .image-accent-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          border-radius: var(--border-radius-md);
          background: linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
          pointer-events: none;
        }

        .floating-badge {
          position: absolute;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: var(--font-family-header) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 5;
        }

        .floating-badge.green {
          top: 20%;
          left: -40px;
          background: rgba(255,255,255,0.9);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);
        }

        .floating-badge.red {
          bottom: 20%;
          right: -30px;
          background: rgba(255,255,255,0.9);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .landing-content {
          width: 100%;
          max-width: 1200px;
        }

        /* Meal Decider Quiz Container */
        .decider-section {
          padding: 2.5rem;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
          margin-bottom: 4rem;
        }

        .decider-header {
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1.25rem;
        }

        .decider-header h2 {
          font-size: 1.45rem;
          color: var(--text-primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 0.4rem;
        }

        .decider-icon {
          color: var(--accent);
        }

        .decider-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .decider-body {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .decider-quiz-step {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .decider-quiz-step h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .decider-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 700px;
          margin-bottom: 1.5rem;
        }

        .decider-option-card {
          padding: 1.75rem;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--glass-border);
          background: var(--bg-primary);
          cursor: pointer;
          transition: var(--transition-elastic);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .decider-option-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.04);
        }

        .decider-option-card.spicy:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.03);
        }

        .decider-option-card.healthy:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.03);
        }

        .decider-option-card.quick:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.03);
        }

        .decider-option-card.leisurely:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.03);
        }

        .decider-option-card .emoji {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }

        .decider-option-card .title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
          font-family: var(--font-family-header) !important;
        }

        .decider-option-card .desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
          font-weight: 500;
        }

        .start-quiz-btn {
          padding: 14px 40px;
          font-size: 1rem;
        }

        .back-quiz-btn {
          font-size: 0.85rem;
          padding: 8px 20px;
        }

        /* Decider result box */
        .decider-result-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          width: 100%;
        }

        .decider-result-box h3 {
          font-size: 1.2rem;
          color: var(--accent);
          font-weight: 700;
        }

        .decider-result-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem;
          max-width: 500px;
          width: 100%;
          border-radius: var(--border-radius-md);
          background: var(--bg-primary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .decider-result-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.08);
        }

        .decider-result-thumb {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: var(--border-radius-sm);
        }

        .decider-result-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          min-width: 0;
        }

        .decider-result-info h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .decider-result-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
          font-weight: 500;
        }

        .view-decider-btn {
          padding: 6px 14px;
          font-size: 0.78rem;
        }

        /* Popular categories chips */
        .popular-categories {
          margin-bottom: 4rem;
          text-align: center;
        }

        .section-title {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .category-chips {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .category-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255,255,255,0.7);
          transition: var(--transition-elastic);
          box-shadow: 0 6px 20px rgba(0,0,0,0.03);
        }

        .category-chip:hover {
          background: rgba(16, 185, 129, 0.08);
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Trending Slider Carousel */
        .trending-carousel-section {
          padding: 2.5rem;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
          margin-bottom: 2rem;
          text-align: center;
        }

        .carousel-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1.25rem;
        }

        .carousel-header h2 {
          font-size: 1.45rem;
          color: var(--text-primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 0.4rem;
        }

        .text-rose {
          color: var(--accent-red);
        }

        .carousel-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .carousel-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .carousel-nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: white;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          z-index: 10;
        }

        .carousel-nav-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
          box-shadow: 0 4px 15px var(--accent-glow);
        }

        .carousel-slide-viewport {
          flex-grow: 1;
          height: 300px;
          overflow: hidden;
          position: relative;
          border-radius: var(--border-radius-md);
        }

        .carousel-slide-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          overflow: hidden;
          border-radius: var(--border-radius-md);
        }

        .carousel-slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .carousel-slide-card:hover .carousel-slide-image {
          transform: scale(1.05);
        }

        .carousel-slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);
        }

        .carousel-slide-content {
          position: absolute;
          bottom: 1.5rem;
          left: 2rem;
          right: 2rem;
          text-align: left;
          color: white;
        }

        .carousel-slide-tag {
          display: inline-block;
          background: var(--accent);
          color: white;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          font-family: var(--font-family-header) !important;
          margin-bottom: 0.6rem;
          box-shadow: 0 2px 8px var(--accent-glow);
        }

        .carousel-slide-content h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .carousel-slide-content p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: var(--glass-border);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .carousel-dot.active {
          background: var(--accent);
          width: 24px;
          border-radius: 10px;
        }

        /* Results section */
        .results-content {
          width: 100%;
          max-width: 1200px;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
        }

        .results-header h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .no-results-panel {
          padding: 4rem 2rem;
          text-align: center;
          max-width: 500px;
          margin: 2rem auto;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
        }

        .no-results-emoji {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .no-results-panel h3 {
          color: var(--text-primary);
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .no-results-panel p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Exploding Emojis CSS Portal */
        .emoji-overlay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .exploding-emoji {
          position: absolute;
          font-size: 1.8rem;
          display: inline-block;
        }

        @media (max-width: 992px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            text-align: center;
          }
          .hero-left {
            align-items: center;
            text-align: center;
          }
          .hero-left h1 {
            font-size: 3.5rem;
            text-align: center;
          }
          .tagline {
            margin: 0 auto 0.75rem;
            text-align: center;
          }
          .search-section-hero {
            margin: 0 auto;
          }
          .hero-burger-overlay {
            width: 120px;
            left: -20px;
            top: -20px;
          }
          .floating-badge.green {
            left: -15px;
          }
          .floating-badge.red {
            right: -15px;
          }
          .decider-options-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .carousel-container {
            gap: 1rem;
          }
          .carousel-nav-btn {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
