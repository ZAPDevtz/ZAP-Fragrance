import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SectionProps } from '../types';

const Section: React.FC<SectionProps> = ({ children, className = "", id = "" }) => {
  const ref = useRef<HTMLElement>(null);
  
  // Track scroll progress of this specific section relative to the viewport
  // "start end": when the top of the element meets the bottom of the viewport
  // "end start": when the bottom of the element meets the top of the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax Y movement: Moves against the scroll direction slightly to create depth
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  // Smooth out the movement for a luxury feel
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothY = useSpring(y, springConfig);

  // Opacity fade in/out based on scroll position
  // Fades in during the first 20% of visibility, stays visible, fades out in the last 10%
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ y: smoothY, opacity }}
      className={`relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default Section;