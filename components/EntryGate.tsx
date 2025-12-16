import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EntryGate = () => {
  const { themeMode, setThemeMode, dayImage, nightImage, accentColor } = useTheme();

  if (themeMode !== 'unset') return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-stone-900 overflow-hidden font-serif">
      {/* LEFT SIDE - DAY */}
      <div 
        onClick={() => setThemeMode('day')}
        className="relative flex-1 h-1/2 md:h-full group cursor-pointer overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-stone-200/20"
      >
        <div className="absolute inset-0 bg-stone-100 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
          <img src={dayImage} className="w-full h-full object-cover opacity-90" alt="Day Wedding" />
        </div>
        <div className="absolute inset-0 bg-ivory/30 group-hover:bg-ivory/10 transition-colors duration-700" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-xl border border-white max-w-sm"
          >
            <Sun className="w-8 h-8 text-gold-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl text-stone-900 mb-2">Day Wedding</h2>
            <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-6">A Fragrance to Remember Today</p>
            <span className="inline-flex items-center text-sm font-semibold text-stone-900 border-b border-stone-900 pb-1 group-hover:text-gold-600 group-hover:border-gold-600 transition-colors">
              Select Experience <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - NIGHT */}
      <div 
        onClick={() => setThemeMode('night')}
        className="relative flex-1 h-1/2 md:h-full group cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-stone-900 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
          <img src={nightImage} className="w-full h-full object-cover opacity-80" alt="Night Wedding" />
        </div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-stone-900/80 backdrop-blur-sm p-8 md:p-12 shadow-2xl border border-stone-700 max-w-sm"
          >
            <Moon className="w-8 h-8 text-gold-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl text-white mb-2">Night Wedding</h2>
            <p className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-6">Choose a Scent. Take Home a Memory.</p>
            <span 
              className="inline-flex items-center text-sm font-semibold text-white border-b border-white pb-1 group-hover:text-gold-400 group-hover:border-gold-400 transition-colors"
            >
              Select Experience <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </motion.div>
        </div>
      </div>

      {/* Center Logo Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-white text-stone-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-double border-gold-200">
           <span className="font-serif font-bold text-xl tracking-widest">ZAP</span>
        </div>
      </div>
    </div>
  );
};

export default EntryGate;
