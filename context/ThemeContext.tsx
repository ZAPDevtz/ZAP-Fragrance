import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'day' | 'night' | 'unset';

interface ThemeContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
  dayImage: string;
  setDayImage: (url: string) => void;
  nightImage: string;
  setNightImage: (url: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resetTheme: () => void;
}

const defaultState = {
  accentColor: '#AA8C2C', // Default Gold-600
  // Updated to match the "Perfume Bar" aesthetic (Floral/Light vs Candlelit/Dark)
  dayImage: "https://images.unsplash.com/photo-1595867865636-3c07f2150aee?q=80&w=1469&auto=format&fit=crop", 
  nightImage: "https://images.unsplash.com/photo-1557827983-012eb6ea8dc1?q=80&w=1476&auto=format&fit=crop",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState(defaultState.accentColor);
  const [dayImage, setDayImage] = useState(defaultState.dayImage);
  const [nightImage, setNightImage] = useState(defaultState.nightImage);
  const [themeMode, setThemeMode] = useState<ThemeMode>('unset');

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('zap_theme');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      if (parsed.accentColor) setAccentColor(parsed.accentColor);
      if (parsed.dayImage) setDayImage(parsed.dayImage);
      if (parsed.nightImage) setNightImage(parsed.nightImage);
      if (parsed.themeMode) setThemeMode(parsed.themeMode);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('zap_theme', JSON.stringify({ accentColor, dayImage, nightImage, themeMode }));
  }, [accentColor, dayImage, nightImage, themeMode]);

  const resetTheme = () => {
    setAccentColor(defaultState.accentColor);
    setDayImage(defaultState.dayImage);
    setNightImage(defaultState.nightImage);
    setThemeMode('unset');
  };

  // Define CSS variables based on mode
  const getThemeVariables = () => {
    const isNight = themeMode === 'night';
    
    return {
      '--brand-accent': accentColor,
      '--brand-accent-light': `${accentColor}20`,
      
      // Dynamic Palette
      '--bg-primary': isNight ? '#0C0A09' : '#FAFAF9', // stone-950 vs stone-50
      '--text-primary': isNight ? '#F5F5F4' : '#1C1917', // stone-100 vs stone-900
      '--text-secondary': isNight ? '#A8A29E' : '#78716C', // stone-400 vs stone-500
      
      // Components
      '--nav-bg': isNight ? 'rgba(12, 10, 9, 0.8)' : 'rgba(255, 255, 240, 0.8)',
      '--card-bg': isNight ? 'rgba(28, 25, 23, 0.6)' : 'rgba(255, 255, 255, 0.4)',
      '--card-border': isNight ? '#44403C' : '#E7E5E4', // stone-700 vs stone-200
      
      // Buttons
      '--btn-bg': isNight ? accentColor : '#1C1917',
      '--btn-text': isNight ? '#1C1917' : '#F9F1D8',
      '--btn-hover-bg': isNight ? '#F9F1D8' : 'transparent',
      '--btn-hover-text': isNight ? '#1C1917' : '#1C1917',
    } as React.CSSProperties;
  };

  return (
    <ThemeContext.Provider value={{ 
      accentColor, 
      setAccentColor, 
      dayImage, 
      setDayImage, 
      nightImage, 
      setNightImage,
      themeMode,
      setThemeMode,
      resetTheme
    }}>
      <div 
        className="transition-colors duration-1000 ease-in-out"
        style={getThemeVariables()}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
