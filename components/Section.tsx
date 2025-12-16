import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../types';

const Section: React.FC<SectionProps> = ({ children, className = "", id = "" }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default Section;