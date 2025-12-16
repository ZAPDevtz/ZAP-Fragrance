import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-8 py-3 uppercase tracking-widest text-xs font-semibold transition-all duration-300 ease-in-out border";
  
  // Using CSS variables defined in ThemeContext
  const variants = {
    primary: "bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-bg)] hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] hover:border-[var(--brand-accent)]",
    outline: "bg-transparent text-[var(--text-primary)] border-[var(--text-primary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
