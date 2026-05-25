
<div align="center">
  <h1>👨‍🍳 Spicy-Fy</h1>
  <p><strong>A MERN-Ready Smart Recipe Finder & Meal Planner</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  </p>
</div>

---

 📖 About The Project

Welcome to **Spicy-Fy**! This project has been upgraded from a traditional single-page HTML/CSS site into a highly structured, component-based, MERN-stack-ready React Single Page Application (SPA). 

Designed with premium dark-themed styling, Spicy-Fy provides advanced Framer Motion page slide transitions, persistent user states, and highly interactive culinary workflows. Whether you want to explore new recipes, plan your weekly meals, or create your own custom cookbook, Spicy-Fy has you covered.

---

## ✨ Key Features

- **🎨 Modern UI & Animations:** Clean dark mode aesthetics with Framer Motion integrations for smooth slide-and-fade page transitions, elastic card lifts, and floating badges.
- **🗓️ Weekly Meal Planner:** Plan your Breakfast, Lunch, and Dinner across all 7 days of the week easily.
- **🛒 Smart Grocery Checklist:** Automatically compiles ingredients from your planned recipes into a single aggregated grocery list, sorting quantities and removing duplicates.
- **📝 Personal Custom Cookbook:** Add custom recipes using an interactive form. It supports image uploads that are converted to Base64 strings to ensure your recipes always have their photos.
- **💬 Interactive Reviews & Ratings:** Prep-work included for the database API. Users can submit star ratings (1-5) and write comments on recipes.
- **💾 Persistent Storage:** User favorites, planner calendars, checked shopping items, and custom recipes are instantly written to `localStorage`, allowing them to survive page reloads.

---

 🛠️ Tech Stack

**Frontend:**
- [React 19](https://react.dev/) - Component-based UI library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library for React
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) - For celebratory animations
- Vanilla CSS - Custom design system, styling, and animation variables

**Architecture:**
- Component-Based Architecture
- React Context API for Global State Management

---

 📂 Project Structure

```text
RECIPE APP/
├── frontend/                     # React Single Page Application (SPA)
│   ├── public/                   # Public static assets
│   ├── src/
│   │   ├── assets/               # Image/SVG imports
│   │   ├── components/           # Reusable UI Components
│   │   │   ├── Navbar.jsx        # Floating nav header with active slider
│   │   │   ├── Footer.jsx        # Layout footer with custom SVGs
│   │   │   └── MealCard.jsx      # Card wrapper with hover effects & fav toggle
│   │   ├── context/
│   │   │   └── RecipeContext.jsx # Global State Management (persisted)
│   │   ├── pages/                # SPA Pages (Minimum 5 pages)
│   │   │   ├── Home.jsx          # Discovery, search trigger, trending grid
│   │   │   ├── Explore.jsx       # Advanced search filters (cuisine, category)
│   │   │   ├── Favorites.jsx     # Saved favorites collection
│   │   │   ├── MealPlanner.jsx   # Weekly calendar scheduler + shopping list
│   │   │   ├── AddRecipe.jsx     # Form creator with Base64 photo uploader
│   │   │   └── RecipeDetail.jsx  # Recipe inspector + checkbox checkoff + review board
│   │   ├── App.css               # Page overrides
│   │   ├── index.css             # Vanilla CSS design tokens & animation variables
│   │   ├── App.jsx               # Page router & transition wrapper
│   │   └── main.jsx              # React mounting root
│   ├── index.html                # Root HTML with Google Fonts & SEO meta tags
│   ├── package.json              # Client dependencies
│   └── vite.config.js            # Vite configurations
├── index.html                    # [Backup] Original HTML
├── script.js                     # [Backup] Original JS
├── style.css                     # [Backup] Original CSS
├── SPICY-FY-PROJECT-REPORT.doc   # Academic project report documentation
└── SPICY-FY-SYNOPSIS.doc         # Academic synopsis documentation
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AshishSinghThakur07/Code264-SpicyFY.git
   ```

2. **Navigate into the project directory and frontend folder:**
   ```bash
   cd Code264-SpicyFY/frontend
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Open your browser and visit `http://localhost:5173` to view Spicy-Fy in action!

---

## 🛣️ Roadmap / MERN Stack Transition

Since the frontend is built modularly with React Context and standard API schemas, adding the **Node/Express** server and **MongoDB** database is straightforward:

- [ ] **Database Setup (MongoDB):**
  - Create `recipes` collection for user custom recipes.
  - Create `users` collection for favorite lists, planner states, and profiles.
  - Create `reviews` collection to link review texts and star ratings to recipe IDs.
- [ ] **Backend Server (Express/Node.js):**
  - `POST /api/recipes` - Save custom recipes and handle image uploads.
  - `GET /api/recipes` - Query custom and external recipes.
  - `POST /api/reviews` - Persist user comments and ratings.
- [ ] **Authentication:**
  - Implement JWT-based user authentication.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License.

---

<div align="center">
  <p>Made with ❤️ by Ashish Singh Thakur</p>
</div>
```

