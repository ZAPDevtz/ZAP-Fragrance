import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EntryGate = () => {
  const { themeMode, setThemeMode, dayImage, nightImage, accentColor } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSelect = (mode: 'day' | 'night') => {
    setIsExiting(true);
    setDirection(mode === 'day' ? 'left' : 'right');
    // Delay actual state change to allow animation to play
    setTimeout(() => {
      setThemeMode(mode);
    }, 1500);
  };

  // If themeMode is set externally (e.g. from local storage on load), return null immediately
  if (themeMode !== 'unset' && !isExiting) return null;

  const leftDoorVariants = {
    initial: { rotateY: 0, x: 0 },
    exit: { 
      rotateY: -100, 
      x: -50,
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
    }
  };

  const rightDoorVariants = {
    initial: { rotateY: 0, x: 0 },
    exit: { 
      rotateY: 100, 
      x: 50,
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-stone-900 font-serif"
      style={{ perspective: "1500px", overflow: "hidden" }}
    >
        {/* Background that reveals itself behind the doors */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 bg-[var(--bg-primary)] flex items-center justify-center"
        >
            <span className="text-[var(--brand-accent)] opacity-20 text-9xl font-serif">ZAP</span>
        </motion.div>

      {/* LEFT SIDE - DAY DOOR */}
      <motion.div 
        variants={leftDoorVariants}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
        style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
        onClick={() => !isExiting && handleSelect('day')}
        className="relative flex-1 h-1/2 md:h-full group cursor-pointer border-b-2 md:border-b-0 md:border-r-2 border-stone-200/20 z-10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-stone-100 transition-transform duration-[1.5s] ease-out group-hover:scale-105">
          <img src={dayImage} className="w-full h-full object-cover opacity-90" alt="Day Wedding" />
        </div>
        <div className="absolute inset-0 bg-ivory/30 group-hover:bg-ivory/10 transition-colors duration-700" />
        
        {/* Door Knob / Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8" style={{ transform: "translateZ(30px)" }}>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-xl border border-white max-w-sm transform-3d"
          >
            <Sun className="w-8 h-8 text-gold-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl text-stone-900 mb-2">Day Wedding</h2>
            <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-6">A Fragrance to Remember Today</p>
            <span className="inline-flex items-center text-sm font-semibold text-stone-900 border-b border-stone-900 pb-1 group-hover:text-gold-600 group-hover:border-gold-600 transition-colors">
              Select Experience <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - NIGHT DOOR */}
      <motion.div 
        variants={rightDoorVariants}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
        style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
        onClick={() => !isExiting && handleSelect('night')}
        className="relative flex-1 h-1/2 md:h-full group cursor-pointer z-10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-stone-900 transition-transform duration-[1.5s] ease-out group-hover:scale-105">
          <img src={nightImage} className="w-full h-full object-cover opacity-80" alt="Night Wedding" />
        </div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8" style={{ transform: "translateZ(30px)" }}>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-stone-900/80 backdrop-blur-sm p-8 md:p-12 shadow-2xl border border-stone-700 max-w-sm transform-3d"
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
      </motion.div>

      {/* Center Logo Badge - Fades out on exit */}
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.5 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
      >
        <div className="bg-white text-stone-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-double border-gold-200">
           <span className="font-serif font-bold text-xl tracking-widest">ZAP</span>
        </div>
      </motion.div>
    </div>
  );
};

export default EntryGate;