import React, { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const AddRecipe = () => {
  const { addCustomRecipe, setPage } = useContext(RecipeContext);

  // Form Fields State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetarian');
  const [area, setArea] = useState('Indian');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', measure: '' }]);
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Errors state
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const categories = ['Breakfast', 'Dessert', 'Vegetarian', 'Seafood', 'Pasta', 'Chicken', 'Beef', 'Pork', 'Lamb', 'Side', 'Starter', 'Vegan'];
  const areas = ['Indian', 'Italian', 'Mexican', 'Chinese', 'French', 'American', 'British', 'Japanese', 'Greek', 'Thai', 'Spanish', 'Unknown'];

  // Handle Image Upload & convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 2MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
        setImagePreview(reader.result);
        setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic ingredient rows
  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: '', measure: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  // Form Submission & Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Recipe name is required';
    if (!instructions.trim()) newErrors.instructions = 'Cooking instructions are required';
    
    const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Please add at least one ingredient';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Success - add recipe
    const customRecipe = {
      strMeal: name.trim(),
      strCategory: category,
      strArea: area,
      strInstructions: instructions.trim(),
      strMealThumb: imagePreview || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop',
      ingredients: validIngredients,
      isCustom: true
    };

    addCustomRecipe(customRecipe);
    
    // Confetti burst!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#ef4444', '#f9d423', '#ffffff']
    });

    setSuccess(true);
    
    // Reset Form
    setName('');
    setCategory('Vegetarian');
    setArea('Indian');
    setInstructions('');
    setIngredients([{ name: '', measure: '' }]);
    setImage('');
    setImagePreview(null);
    setErrors({});

    setTimeout(() => {
      setSuccess(false);
      setPage('home');
    }, 2500);
  };

  return (
    <motion.div
      className="page-container add-recipe-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="add-recipe-header">
        <h1>Create Custom Recipe</h1>
        <p>Catalog your secret family recipes directly into your persistent digital cookbook</p>
      </header>

      <AnimatePresence>
        {success && (
          <motion.div
            className="success-banner glass-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="success-icon-wrapper">
              <i className="bi bi-check-lg" style={{ fontSize: 24 }}></i>
            </div>
            <div className="success-text">
              <h3>Recipe Added Successfully!</h3>
              <p>Your creation has been saved to your custom cookbook. Redirecting...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="add-recipe-form glass-panel">
        {/* Basic Details Grid */}
        <div className="form-grid">
          <div className="form-left-col">
            <div className="form-group">
              <label className="form-label">Recipe Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grandma's Secret Butter Chicken"
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && (
                <span className="error-message">
                  <i className="bi bi-exclamation-circle"></i> {errors.name}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input select-input"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Cuisine/Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="form-input select-input"
                >
                  {areas.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Photo Uploader */}
          <div className="form-right-col">
            <div className="image-upload-wrapper">
              <label className="form-label">Recipe Photo</label>
              <div className="image-picker-box glass-panel">
                {imagePreview ? (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setImagePreview(null);
                      }}
                      className="remove-preview-btn"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <label className="upload-placeholder-btn">
                    <i className="bi bi-camera camera-icon"></i>
                    <span>Upload Image</span>
                    <span className="upload-subtitle">(PNG, JPG up to 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden-file-input"
                    />
                  </label>
                )}
              </div>
              {errors.image && (
                <span className="error-message">
                  <i className="bi bi-exclamation-circle"></i> {errors.image}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients Block */}
        <div className="ingredients-section-block">
          <div className="section-header">
            <h3>Ingredients</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="btn-secondary add-ing-btn"
            >
              <i className="bi bi-plus"></i> Add Ingredient
            </button>
          </div>

          {errors.ingredients && (
            <span className="error-message margin-bottom">
              <i className="bi bi-exclamation-circle"></i> {errors.ingredients}
            </span>
          )}

          <div className="ingredients-rows-container">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-input-row">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  placeholder="Ingredient (e.g. Garlic Cloves)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={ing.measure}
                  onChange={(e) => handleIngredientChange(idx, 'measure', e.target.value)}
                  placeholder="Quantity (e.g. 4 minced)"
                  className="form-input measure-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="remove-row-btn"
                  disabled={ingredients.length === 1}
                  title="Remove Ingredient"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Textarea */}
        <div className="form-group margin-top">
          <label className="form-label">Cooking Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Write step-by-step cooking guide here..."
            rows={6}
            className={`form-input textarea-input ${errors.instructions ? 'error' : ''}`}
          />
          {errors.instructions && (
            <span className="error-message">
              <i className="bi bi-exclamation-circle"></i> {errors.instructions}
            </span>
          )}
        </div>

        {/* Submit */}
        <div className="form-submit-row">
          <button type="submit" className="btn-primary submit-recipe-btn">
            Publish to Cookbook
          </button>
        </div>
      </form>

      <style>{`
        .add-recipe-page {
          max-width: 900px;
        }

        .add-recipe-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .add-recipe-header h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .add-recipe-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.05);
        }

        .success-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          flex-shrink: 0;
        }

        .success-text h3 {
          color: var(--text-primary);
          font-size: 1.15rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .success-text p {
          color: var(--text-secondary);
          font-size: 0.92rem;
          font-weight: 500;
        }

        .add-recipe-form {
          padding: 3rem;
          border-radius: var(--border-radius-lg);
          background: var(--bg-secondary);
          box-shadow: var(--card-shadow);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }

        .form-left-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .flex-1 {
          flex: 1;
        }

        .select-input {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          padding-right: 40px;
          appearance: none;
          font-weight: 600;
        }

        /* Image Picker Box */
        .image-upload-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .image-picker-box {
          flex-grow: 1;
          border: 1.5px dashed var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background: rgba(0,0,0,0.01);
          min-height: 200px;
        }

        .image-picker-box:hover {
          border-color: rgba(16, 185, 129, 0.4);
        }

        .upload-placeholder-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          cursor: pointer;
          padding: 2rem;
          text-align: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }

        .camera-icon {
          color: var(--text-muted);
          transition: var(--transition-smooth);
          font-size: 2.2rem;
        }

        .upload-placeholder-btn:hover .camera-icon {
          color: var(--accent);
          transform: scale(1.08);
        }

        .upload-placeholder-btn span {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .upload-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .hidden-file-input {
          display: none;
        }

        .preview-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 200px;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-preview-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 10px var(--accent-red-glow);
        }

        .remove-preview-btn:hover {
          background: var(--accent-red);
          transform: translateY(-2px);
        }

        /* Ingredients rows */
        .ingredients-section-block {
          margin-bottom: 2.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .add-ing-btn {
          padding: 6px 16px;
          font-size: 0.85rem;
          gap: 4px;
        }

        .ingredients-rows-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .ingredient-input-row {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .measure-input {
          max-width: 240px;
        }

        .remove-row-btn {
          background: rgba(0,0,0,0.01);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          width: 48px;
          height: 48px;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
          flex-shrink: 0;
          font-size: 1.1rem;
        }

        .remove-row-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.08);
          border-color: var(--accent-red);
          color: var(--accent-red);
        }

        .remove-row-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Warnings */
        .form-input.error {
          border-color: var(--accent-red);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--accent-red);
          font-size: 0.82rem;
          font-weight: 600;
          margin-top: 4px;
        }

        .error-message.margin-bottom {
          margin-bottom: 1rem;
          margin-top: -4px;
        }

        .textarea-input {
          resize: vertical;
          line-height: 1.5;
        }

        .form-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .submit-recipe-btn {
          padding: 14px 40px;
          font-size: 1rem;
        }

        .margin-top {
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .add-recipe-form {
            padding: 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .form-row {
            flex-direction: column;
            gap: 1.5rem;
          }
          .ingredient-input-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            position: relative;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--glass-border);
          }
          .measure-input {
            max-width: 100%;
          }
          .remove-row-btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </motion.div>
  );
};
