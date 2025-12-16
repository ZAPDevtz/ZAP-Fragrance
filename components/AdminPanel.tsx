import React, { useState } from 'react';
import { Settings, Upload, X, RotateCcw, Image as ImageIcon, Check, Moon, Sun, LayoutTemplate } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    accentColor, setAccentColor, 
    dayImage, setDayImage, 
    nightImage, setNightImage,
    themeMode, setThemeMode,
    resetTheme 
  } = useTheme();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] bg-stone-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-stone-700"
        title="Open Admin Panel"
      >
        <Settings size={24} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[101] border-l border-stone-200 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl text-stone-900">Admin Control</h2>
                  <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Mode Selection */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-semibold">Atmosphere Mode</h3>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setThemeMode('day')}
                         className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 border ${themeMode === 'day' ? 'bg-gold-100 border-gold-400 text-gold-800' : 'bg-stone-50 border-stone-200'}`}
                       >
                         <Sun size={14} /> Day
                       </button>
                       <button 
                         onClick={() => setThemeMode('night')}
                         className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 border ${themeMode === 'night' ? 'bg-stone-800 border-stone-600 text-white' : 'bg-stone-50 border-stone-200'}`}
                       >
                         <Moon size={14} /> Night
                       </button>
                       <button 
                         onClick={() => setThemeMode('unset')}
                         className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 border ${themeMode === 'unset' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-stone-50 border-stone-200'}`}
                         title="Show Entry Gate"
                       >
                         <LayoutTemplate size={14} /> Gate
                       </button>
                    </div>
                  </section>

                  {/* Color Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-semibold">Brand Identity</h3>
                    <div className="space-y-3">
                      <label className="text-sm text-stone-700 block">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-stone-500 uppercase">{accentColor}</span>
                      </div>
                    </div>
                  </section>

                  {/* Aesthetics Section */}
                  <section>
                    <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-semibold">Aesthetics Imagery</h3>
                    
                    {/* Day Image */}
                    <div className="mb-6">
                      <label className="text-sm text-stone-700 block mb-2 flex items-center gap-2">
                        <ImageIcon size={14} /> Day Setup Image
                      </label>
                      <div className="relative group w-full h-32 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 mb-2">
                        <img src={dayImage} alt="Day Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-stone-900 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-gold-100 transition-colors">
                            Change
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setDayImage)} />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Night Image */}
                    <div>
                      <label className="text-sm text-stone-700 block mb-2 flex items-center gap-2">
                        <ImageIcon size={14} /> Night Setup Image
                      </label>
                      <div className="relative group w-full h-32 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 mb-2">
                        <img src={nightImage} alt="Night Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-stone-900 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-gold-100 transition-colors">
                            Change
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setNightImage)} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="pt-8 border-t border-stone-100">
                    <button 
                      onClick={resetTheme}
                      className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors py-3"
                    >
                      <RotateCcw size={14} /> Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
