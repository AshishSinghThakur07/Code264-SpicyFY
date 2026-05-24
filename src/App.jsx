import React, { useContext } from 'react';
import { RecipeContext, RecipeProvider } from './context/RecipeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Favorites } from './pages/Favorites';
import { MealPlanner } from './pages/MealPlanner';
import { AddRecipe } from './pages/AddRecipe';
import { RecipeDetail } from './pages/RecipeDetail';
import { AnimatePresence, motion } from 'framer-motion';

const MainApp = () => {
  const { currentPage } = useContext(RecipeContext);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home key="home" />;
      case 'explore':
        return <Explore key="explore" />;
      case 'favorites':
        return <Favorites key="favorites" />;
      case 'planner':
        return <MealPlanner key="planner" />;
      case 'add-recipe':
        return <AddRecipe key="add-recipe" />;
      case 'recipe-detail':
        return <RecipeDetail key="recipe-detail" />;
      default:
        return <Home key="home" />;
    }
  };

  return (
    <div className="app-layout">
      {/* Floating Navbar */}
      <Navbar />

      {/* Page Content with Framer Motion slide-fade transitions */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex-grow: 1;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <RecipeProvider>
      <MainApp />
    </RecipeProvider>
  );
}

export default App;
