import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
  isLoading: boolean;
  saveSettings: () => Promise<void>;
}

const defaultState = {
  accentColor: '#AA8C2C', 
  dayImage: "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1000&auto=format&fit=crop", 
  nightImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  themeMode: 'unset' as ThemeMode
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState(defaultState.accentColor);
  const [dayImage, setDayImage] = useState(defaultState.dayImage);
  const [nightImage, setNightImage] = useState(defaultState.nightImage);
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultState.themeMode);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single(); // We only expect one row (id: 1)

      if (error) {
        console.error('Error fetching settings:', error);
        // Fallback to local storage if DB fails or is empty
        loadFromLocalStorage();
        return;
      }

      if (data) {
        setAccentColor(data.accent_color || defaultState.accentColor);
        setDayImage(data.day_image_url || defaultState.dayImage);
        setNightImage(data.night_image_url || defaultState.nightImage);
        setThemeMode((data.theme_mode as ThemeMode) || defaultState.themeMode);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedTheme = localStorage.getItem('zap_theme');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      if (parsed.accentColor) setAccentColor(parsed.accentColor);
      if (parsed.dayImage) setDayImage(parsed.dayImage);
      if (parsed.nightImage) setNightImage(parsed.nightImage);
      if (parsed.themeMode) setThemeMode(parsed.themeMode);
    }
    setIsLoading(false);
  };

  // Function to save changes to Supabase (Called by Admin Panel)
  const saveSettings = async () => {
    // 1. Save to local storage for immediate offline backup
    localStorage.setItem('zap_theme', JSON.stringify({ accentColor, dayImage, nightImage, themeMode }));

    // 2. Save to Supabase
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        id: 1, // Singleton Row ID
        accent_color: accentColor,
        day_image_url: dayImage,
        night_image_url: nightImage,
        theme_mode: themeMode
      });

    if (error) {
      console.error("Error saving to Supabase:", error);
      alert("Failed to save settings to cloud. Check console.");
    }
  };

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
      resetTheme,
      isLoading,
      saveSettings
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
