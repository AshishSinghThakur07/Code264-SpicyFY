import React from 'react';

// Common Drop Shadow Filter for all icons to give depth
const IconDefs = () => (
  <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      {/* 3D Drop Shadow */}
      <filter id="glossy-shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.15" />
      </filter>
      
      {/* Metallic Frying Pan Gradients */}
      <linearGradient id="panGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4b5563" />
        <stop offset="40%" stopColor="#374151" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
      <linearGradient id="panInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1f2937" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="panHandleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="50%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>

      {/* Egg Gradients */}
      <radialGradient id="yolkGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffd166" />
        <stop offset="70%" stopColor="#f77f00" />
        <stop offset="100%" stopColor="#d62828" />
      </radialGradient>
      <radialGradient id="whiteGrad" cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="85%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </radialGradient>

      {/* Cupcake Gradients */}
      <linearGradient id="cupcakeWrapper" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
      <radialGradient id="frostingGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fdf2f8" />
        <stop offset="40%" stopColor="#fbcfe8" />
        <stop offset="80%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#db2777" />
      </radialGradient>
      <radialGradient id="cherryGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff4d6d" />
        <stop offset="60%" stopColor="#c9184a" />
        <stop offset="100%" stopColor="#590d22" />
      </radialGradient>

      {/* Vegetarian / Avocado / Salad Gradients */}
      <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="avocadoSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3f20" />
        <stop offset="100%" stopColor="#0a1d0d" />
      </linearGradient>
      <radialGradient id="avocadoFlesh" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#d8f3dc" />
        <stop offset="50%" stopColor="#b7e4c7" />
        <stop offset="85%" stopColor="#74c69d" />
        <stop offset="100%" stopColor="#2d6a4f" />
      </radialGradient>
      <radialGradient id="avocadoPit" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#b5838d" />
        <stop offset="60%" stopColor="#6d597a" />
        <stop offset="100%" stopColor="#355070" />
      </radialGradient>

      {/* Seafood Gradients */}
      <linearGradient id="fishBody" x1="0%" y1="30%" x2="100%" y2="70%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="fishFin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <radialGradient id="lemonGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="90%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>

      {/* Pasta Gradients */}
      <linearGradient id="pastaBowl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffedd5" />
        <stop offset="100%" stopColor="#fed7aa" />
      </linearGradient>
      <linearGradient id="noodleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <radialGradient id="meatballGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="15%" stopColor="#8b5cf6" />
        <stop offset="85%" stopColor="#6d28d9" />
        <stop offset="100%" stopColor="#4c1d95" />
      </radialGradient>
      <radialGradient id="tomatoGrad" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="70%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </radialGradient>

      {/* Chicken Gradients */}
      <linearGradient id="chickenBone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <radialGradient id="chickenMeat" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="40%" stopColor="#f97316" />
        <stop offset="85%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#9a3412" />
      </radialGradient>
    </defs>
  </svg>
);

export const BreakfastIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Pan Handle with 3D bevel */}
      <rect x="36" y="24" width="20" height="7" rx="3.5" fill="url(#panHandleGrad)" transform="rotate(30 36 24)" />
      <circle cx="53" cy="34" r="1.5" fill="#111827" />

      {/* Pan Outer Lip */}
      <circle cx="26" cy="38" r="19" fill="url(#panGrad)" />
      {/* Pan Inner Cook Area */}
      <circle cx="26" cy="38" r="15.5" fill="url(#panInnerGrad)" />

      {/* 3D Shiny Metallic Highlight on Pan Rim */}
      <path d="M9 31C11.5 25 17 21 24 20" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

      {/* Egg White - Glossy Multi-layered */}
      <path d="M16 38C16 32 20 28 26 29C32 30 35 33 36 37C37 41 33 45 28 46C23 47 16 44 16 38Z" fill="url(#whiteGrad)" />
      {/* Egg White shadow/depth */}
      <path d="M18 39C18 35 21 31 26 32C31 33 33 35 34 38C35 41 32 43 28 44C24 45 18 43 18 39Z" fill="#e2e8f0" opacity="0.5" />

      {/* Egg Yolk - Rich 3D Sphere */}
      <circle cx="25" cy="37" r="5.5" fill="url(#yolkGrad)" />
      {/* Yolk specular highlight */}
      <circle cx="23.2" cy="35.2" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="24.2" cy="36.2" r="0.6" fill="#ffffff" opacity="0.5" />

      {/* Pepper sprinkles */}
      <circle cx="28" cy="33" r="0.4" fill="#000000" opacity="0.6" />
      <circle cx="31" cy="37" r="0.4" fill="#000000" opacity="0.6" />
      <circle cx="21" cy="41" r="0.4" fill="#000000" opacity="0.6" />
    </svg>
  </>
);

export const DessertIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Cupcake Wrapper Base */}
      <path d="M19 35L23 52C23.5 54 25 55 27 55H37C39 55 40.5 54 41 52L45 35H19Z" fill="url(#cupcakeWrapper)" />
      {/* Wrapper Plies with gradient shades */}
      <path d="M23 35L26 55" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M29 35L30 55" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M35 35L34 55" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M41 35L38 55" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Cake Crust showing */}
      <ellipse cx="32" cy="35" rx="13.5" ry="3.5" fill="#d97706" />

      {/* Fluffy 3D Frosting Swirls */}
      {/* Bottom layer */}
      <path d="M15 34C13 34 13 29 17 28C21 27 22 30 26 27C30 24 34 24 38 27C42 30 43 27 47 28C51 29 51 34 49 34H15Z" fill="url(#frostingGrad)" />
      {/* Middle Layer */}
      <path d="M19 28C18 28 18 24 22 23C26 22 28 25 32 23C36 21 38 24 42 23C46 22 46 28 45 28H19Z" fill="url(#frostingGrad)" />
      {/* Top Cap */}
      <path d="M24 23C24 21 26 18 32 17C38 18 40 21 40 23C38 25 26 25 24 23Z" fill="url(#frostingGrad)" />

      {/* Specular highlights on frosting swirls */}
      <path d="M18 29.5C21 28.5 24 30 27 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M23 23.5C26 22.5 29 24 32 23.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Sprinkles (Teal, Purple, Yellow) */}
      <rect x="22" y="29" width="3" height="1.2" rx="0.6" fill="#06b6d4" transform="rotate(30 22 29)" />
      <rect x="30" y="27" width="3" height="1.2" rx="0.6" fill="#eab308" transform="rotate(-15 30 27)" />
      <rect x="38" y="29" width="3" height="1.2" rx="0.6" fill="#a855f7" transform="rotate(45 38 29)" />
      <rect x="27" y="22" width="3" height="1.2" rx="0.6" fill="#06b6d4" transform="rotate(-40 27 22)" />
      <rect x="35" y="22" width="3" height="1.2" rx="0.6" fill="#eab308" transform="rotate(20 35 22)" />

      {/* Cherry on top (Rich 3D Sphere) */}
      <circle cx="32" cy="15" r="5" fill="url(#cherryGrad)" />
      <circle cx="30.2" cy="13.2" r="1.5" fill="#ffffff" opacity="0.8" />
      {/* Stem */}
      <path d="M32 11C33.5 6 38.5 4 41.5 4" stroke="#4c0519" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </>
);

export const VegetarianIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Avocado Skin Back */}
      <path d="M26 14C35 14 43 20 43 32C43 43 35 50 26 50C17 50 14 43 14 32C14 20 17 14 26 14Z" fill="url(#avocadoSkin)" />
      {/* Avocado Flesh Inner */}
      <path d="M26 16.5C33.5 16.5 40.5 22 40.5 32C40.5 41.5 33.5 47.5 26 47.5C18.5 47.5 16 41.5 16 32C16 22 18.5 16.5 26 16.5Z" fill="url(#avocadoFlesh)" />

      {/* Pit Hole shadow */}
      <circle cx="26" cy="35" r="7.5" fill="#52b788" opacity="0.4" />
      {/* Avocado Pit (3D sphere) */}
      <circle cx="26" cy="35" r="6.8" fill="url(#avocadoPit)" />
      <circle cx="24.2" cy="33.2" r="1.8" fill="#ffffff" opacity="0.75" />

      {/* Fresh Salad Leaves overflowing behind avocado */}
      <path d="M35 18C37 15 41 16 42 19C43 22 40 25 37 24C35 23 34 20 35 18Z" fill="#40916c" />
      <path d="M43 26C46 24 49 27 48 30C47 33 43 32 42 30C41 28 42 27 43 26Z" fill="#2d6a4f" opacity="0.85" />
      {/* Speck of bright yellow lemon juice droplet */}
      <circle cx="44" cy="22" r="1.5" fill="#facc15" />

      {/* Juicy Cherry Tomato Slice */}
      <circle cx="16" cy="24" r="5.5" fill="url(#tomatoGrad)" />
      {/* Tomato inside detail */}
      <circle cx="16" cy="24" r="4.2" fill="#991b1b" />
      <path d="M14.5 22.5C15 22.5 15.5 23 15.5 23.5C15.5 24 15 24.5 14.5 24.5C14 24.5 13.5 24 13.5 23.5C13.5 23 14 22.5 14.5 22.5Z" fill="#fca5a5" />
      <path d="M17.5 23.5C18 23.5 18.5 24 18.5 24.5C18.5 25 18 25.5 17.5 25.5C17 25.5 16.5 25 16.5 24.5C16.5 24 17 23.5 17.5 23.5Z" fill="#fca5a5" />
      {/* Tomato highlight */}
      <ellipse cx="15.2" cy="21.5" rx="1.2" ry="0.6" fill="#ffffff" opacity="0.8" transform="rotate(-30 15.2 21.5)" />
    </svg>
  </>
);

export const SeafoodIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Tail Fin */}
      <path d="M15 32L5 22V42L15 32Z" fill="url(#fishFin)" />
      <path d="M13 32L6 25V39L13 32Z" fill="#0284c7" opacity="0.5" />

      {/* Back Dorsal Fin */}
      <path d="M31 24C28 17 35 15 38 23Z" fill="url(#fishFin)" />
      {/* Bottom Ventral Fin */}
      <path d="M31 40C28 47 35 49 38 41Z" fill="url(#fishFin)" />

      {/* Main Fish Body (Glossy 3D Aerodynamic shape) */}
      <path d="M12 32C20 20 40 18 52 32C40 46 20 44 12 32Z" fill="url(#fishBody)" />

      {/* 3D Gills and scale highlights */}
      <path d="M41 27C39 29 39 35 41 37" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <path d="M36 28C34 29 34 33 36 35" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      
      {/* Specular reflection on fish back */}
      <path d="M22 25C29 21 38 21 44 24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

      {/* Eye (Glossy 3D) */}
      <circle cx="45" cy="30" r="3.5" fill="#0f172a" />
      <circle cx="46" cy="29" r="1.2" fill="#ffffff" />
      <circle cx="44.2" cy="30.8" r="0.5" fill="#ffffff" opacity="0.6" />

      {/* Fresh Lemon slice resting in foreground */}
      <circle cx="18" cy="42" r="7" fill="url(#lemonGrad)" />
      <circle cx="18" cy="42" r="5.5" fill="#ffffff" />
      {/* Lemon wedges */}
      <path d="M18 42L18 37" stroke="#eab308" strokeWidth="1" />
      <path d="M18 42L22 39" stroke="#eab308" strokeWidth="1" />
      <path d="M18 42L22 45" stroke="#eab308" strokeWidth="1" />
      <path d="M18 42L14 45" stroke="#eab308" strokeWidth="1" />
      <path d="M18 42L14 39" stroke="#eab308" strokeWidth="1" />
      <circle cx="18" cy="42" r="1.5" fill="url(#lemonGrad)" />
    </svg>
  </>
);

export const PastaIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Ceramic Pasta Bowl Outer */}
      <path d="M13 32C13 46 21 52 32 52C43 52 51 46 51 32H13Z" fill="url(#pastaBowl)" />
      {/* Bowl Inside Rim */}
      <ellipse cx="32" cy="32" rx="19" ry="5.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Bowl Bottom Shadow */}
      <ellipse cx="32" cy="51.5" rx="10" ry="2.2" fill="#cbd5e1" />

      {/* Rich Golden Spaghetti Nest */}
      {/* Base noodle loops */}
      <path d="M18 32C20 24 25 36 29 28C33 20 37 36 41 28C44 22 46 34 48 32" stroke="url(#noodleGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M16 34C20 28 22 38 27 31C32 24 35 38 39 31C43 24 45 38 47 34" stroke="url(#noodleGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 30C23 25 27 34 32 30C37 26 39 34 43 30" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />

      {/* Delicious Italian Tomato Sauce Dollop */}
      <path d="M26 29C25 27 28 23 31 23C34 23 33 26 37 25C40 24 39 28 37 30C34 32 29 32 26 29Z" fill="url(#tomatoGrad)" />
      <circle cx="31" cy="25" r="1.5" fill="#ffffff" opacity="0.6" />

      {/* Glossy Meatballs (3D spheres) */}
      <circle cx="24" cy="33" r="4.5" fill="url(#meatballGrad)" />
      <circle cx="22.5" cy="31.5" r="1.2" fill="#ffffff" opacity="0.5" />

      <circle cx="38" cy="32" r="4" fill="url(#meatballGrad)" />
      <circle cx="36.8" cy="30.8" r="1" fill="#ffffff" opacity="0.5" />

      {/* Tiny Basil Leaf Garnish */}
      <path d="M31 22C30 19 32 17 33 17C34 17 34 20 33 21C32 22 32 22 31 22Z" fill="#15803d" />
      <path d="M34 23C35 21 37 21 37 22C37 23 35 24 34 24C33 24 33 23 34 23Z" fill="#166534" />
    </svg>
  </>
);

export const ChickenIcon = ({ size = 28 }) => (
  <>
    <IconDefs />
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'url(#glossy-shadow)' }}>
      {/* Bone sticking out (with 3D gradient and joints) */}
      <rect x="35" y="35" width="18" height="6.5" rx="3.2" fill="url(#chickenBone)" transform="rotate(45 35 35)" />
      {/* Joint Knuckles */}
      <circle cx="47.5" cy="47.5" r="4.5" fill="url(#chickenBone)" />
      <circle cx="51.5" cy="43.5" r="4.5" fill="url(#chickenBone)" />
      {/* Joint shadow contrast */}
      <circle cx="46.5" cy="46.5" r="2.5" fill="#cbd5e1" opacity="0.5" />

      {/* Juicy Crispy Fried Chicken Drumstick (Rich 3D Glossy Texture) */}
      <path d="M12 28C10 20 18 10 28 12C38 14 42 22 38 32C34 38 24 38 16 35C14 33 13 31 12 28Z" fill="url(#chickenMeat)" />

      {/* Crunchy Crumb texture details */}
      <circle cx="18" cy="22" r="1" fill="#7c2d12" opacity="0.6" />
      <circle cx="26" cy="18" r="1.2" fill="#7c2d12" opacity="0.6" />
      <circle cx="32" cy="25" r="0.8" fill="#7c2d12" opacity="0.6" />
      <circle cx="22" cy="30" r="1" fill="#7c2d12" opacity="0.6" />
      <circle cx="28" cy="31" r="1.4" fill="#7c2d12" opacity="0.5" />

      {/* Specular highlighting for crispy oil sheen */}
      <path d="M15 25C14 22 19 16 23 15" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <path d="M29 19C33 21 35 24 34 27" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  </>
);
