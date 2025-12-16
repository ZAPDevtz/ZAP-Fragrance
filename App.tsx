import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight, Star, Moon, Sun, Heart, Sparkles as SparklesIcon, MessageCircle } from 'lucide-react';
import Experience3D from './components/Experience3D';
import Section from './components/Section';
import Button from './components/Button';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AdminPanel from './components/AdminPanel';
import EntryGate from './components/EntryGate';

// --- Constants (Content from PDF) ---
const BRAND_NAME = "ZAP FRAGRANCE";

// --- Components ---

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { accentColor } = useTheme();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg-primary)] p-8 md:p-12 shadow-2xl border z-[70] text-center"
            style={{ borderColor: `${accentColor}40` }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
            >
              <X size={20} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center ring-1"
                style={{ 
                  backgroundColor: `${accentColor}15`, 
                  color: accentColor,
                  '--tw-ring-color': `${accentColor}40`
                } as React.CSSProperties}
              >
                <MessageCircle size={24} strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="font-serif text-3xl text-[var(--text-primary)] mb-3">Begin Your Journey</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed font-sans px-4">
              We invite you to discuss your bespoke wedding experience directly with our concierge.
            </p>

            <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)] mb-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
               <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">WhatsApp Concierge</p>
               <p className="font-serif text-2xl text-[var(--text-primary)] tracking-wide">+1 (555) 123-4567</p>
            </div>

            <Button 
              onClick={() => window.open('https://wa.me/15551234567', '_blank')} 
              className="w-full flex justify-center items-center gap-3"
            >
              <span>Start Conversation</span>
            </Button>
            
            <p className="mt-6 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              Limited Availability for {new Date().getFullYear()} Season
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NavBar = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { accentColor } = useTheme();

  const navLinks = [
    { name: "The Experience", href: "#experience" },
    { name: "Day & Night", href: "#aesthetic" },
    { name: "Curations", href: "#tiers" },
    { name: "Contact", href: "#contact" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--card-border)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-serif text-2xl tracking-wider text-[var(--text-primary)]">{BRAND_NAME}</span>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleScroll(e, link.href)}
              style={{ '--hover-color': accentColor } as React.CSSProperties}
              className="text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--hover-color)] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onOpenContact}
            style={{ borderColor: 'currentColor', '--hover-color': accentColor } as React.CSSProperties}
            className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] border-b pb-0.5 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] transition-all"
          >
            Request Proposal
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[var(--text-primary)]">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--card-border)] px-6 py-6"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm uppercase tracking-widest text-[var(--text-primary)]"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { setIsOpen(false); onOpenContact(); }}
              style={{ color: accentColor }}
              className="text-sm uppercase tracking-widest text-left pt-2"
            >
              Request Proposal
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenContact }: { onOpenContact: () => void }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const { accentColor } = useTheme();

  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  const opacityScroll = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ y: yText, opacity: opacityText }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 max-w-3xl"
      >
        <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-6">
          Luxury Wedding Perfume Experience
        </h2>
        <h1 className="font-serif text-5xl md:text-7xl text-[var(--text-primary)] leading-tight mb-8">
          Sensory Memories, <br />
          <span className="italic" style={{ color: accentColor }}>Curated to Linger.</span>
        </h1>
        <p className="font-sans font-light text-[var(--text-secondary)] text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Guests may forget the menu, but they will always remember how your wedding smelled.
        </p>
        <div onClick={onOpenContact}>
          <Button>Request a Curated Experience</Button>
        </div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ opacity: opacityScroll }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 bg-[var(--text-secondary)] overflow-hidden opacity-30">
          <div className="w-full h-1/2 bg-[var(--text-primary)] animate-slide-down"></div>
        </div>
      </motion.div>
    </div>
  );
};

const Introduction = () => {
  const { accentColor } = useTheme();
  return (
    <Section id="intro" className="text-center">
      <div className="max-w-2xl mx-auto">
        <SparklesIcon className="w-8 h-8 mx-auto mb-6 opacity-70" style={{ color: accentColor }} />
        <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">The Art of Scent</h3>
        <p className="font-sans text-[var(--text-secondary)] leading-loose">
          ZAP Fragrance presents a couture-style perfume experience designed exclusively for luxury weddings. 
          This is not a return gift — it is a sensory memory. An elegant perfume booth styled as a luxury pop-up, 
          where guests are invited to discover a fragrance that becomes a keepsake from your celebration.
        </p>
      </div>
    </Section>
  );
};

const ProcessStep = ({ number, title, desc }: { number: string; title: string; desc: string }) => {
  const { accentColor } = useTheme();
  return (
    <div className="flex flex-col items-center text-center space-y-3 p-6 bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] shadow-sm rounded-sm">
      <span className="font-serif text-4xl opacity-50 italic" style={{ color: accentColor }}>{number}</span>
      <h4 className="font-serif text-xl text-[var(--text-primary)]">{title}</h4>
      <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  );
};

const GuestExperience = () => {
  const { accentColor } = useTheme();
  return (
    <Section id="experience">
      <div className="mb-16 text-center">
        <h3 className="font-serif text-4xl text-[var(--text-primary)] mb-4">The Guest Experience</h3>
        <div className="w-16 h-[1px] mx-auto" style={{ backgroundColor: accentColor }}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ProcessStep 
          number="01" 
          title="Discover" 
          desc="Guests approach an elegant, styled perfume bar." 
        />
        <ProcessStep 
          number="02" 
          title="Sample" 
          desc="Guided by attendants to explore curated luxury scents." 
        />
        <ProcessStep 
          number="03" 
          title="Choose" 
          desc="Guests select the fragrance that resonates with them." 
        />
        <ProcessStep 
          number="04" 
          title="Take Home" 
          desc="Received in a personalized, premium keepsake bottle." 
        />
      </div>
    </Section>
  );
};

const Aesthetics = () => {
  const { accentColor, dayImage, nightImage, themeMode } = useTheme();
  // Default to global themeMode if set, otherwise day
  const [activeMode, setActiveMode] = useState<'day' | 'night'>(themeMode === 'night' ? 'night' : 'day');
  const ref = useRef(null);
  
  useEffect(() => {
    if (themeMode === 'day' || themeMode === 'night') {
      setActiveMode(themeMode);
    }
  }, [themeMode]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const rotateImage = useTransform(scrollYProgress, [0, 1], [-2, 2]); 

  return (
    <Section id="aesthetic">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Column */}
        <div className="space-y-8">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
          >
              <h3 className="font-serif text-4xl text-[var(--text-primary)] mb-4">Adaptable Luxury</h3>
              <p className="text-[var(--text-secondary)] leading-loose">
                Every ZAP Fragrance setup is intentionally designed to be photography and reel-friendly. 
                Our aesthetic adapts seamlessly to your venue, shifting from sun-drenched elegance to candle-lit intimacy.
              </p>
          </motion.div>
          
          <div className="space-y-4">
            {/* Day Option */}
            <div 
              onClick={() => setActiveMode('day')}
              className={`group flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-500 border ${activeMode === 'day' ? 'bg-[var(--card-bg)] border-[var(--card-border)] shadow-sm' : 'border-transparent hover:bg-[var(--card-bg)]'}`}
            >
              <div 
                className={`mt-1 p-2 rounded-full transition-colors duration-500 ${activeMode === 'day' ? 'bg-[var(--brand-accent-light)]' : 'text-stone-400 group-hover:text-stone-500'}`}
                style={{ color: activeMode === 'day' ? accentColor : undefined }}
              >
                 <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-serif text-xl transition-colors duration-500 ${activeMode === 'day' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Day Weddings</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Soft ivory and nude palettes, natural light styling, minimal florals, and editorial elegance.</p>
              </div>
            </div>
            
            {/* Night Option */}
            <div 
              onClick={() => setActiveMode('night')}
              className={`group flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-500 border ${activeMode === 'night' ? 'bg-[var(--card-bg)] border-[var(--card-border)] shadow-xl' : 'border-transparent hover:bg-[var(--card-bg)]'}`}
            >
              <div 
                className={`mt-1 p-2 rounded-full transition-colors duration-500 ${activeMode === 'night' ? 'bg-[var(--card-bg)]' : 'text-stone-400 group-hover:text-stone-500'}`}
                style={{ 
                    color: activeMode === 'night' ? accentColor : undefined,
                    backgroundColor: activeMode === 'night' ? 'rgba(0,0,0,0.3)' : undefined
                }}
              >
                 <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-serif text-xl transition-colors duration-500 ${activeMode === 'night' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} style={{ color: activeMode === 'night' ? accentColor : undefined }}>Night Weddings</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Candle-lit ambience, deep emerald and midnight tones, gold accents, and dramatic lighting.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interactive Image Column */}
        <motion.div 
          style={{ y: yImage, scale: scaleImage, rotate: rotateImage }}
          className="relative h-[500px] md:h-[600px] w-full bg-stone-200 overflow-hidden rounded-t-[10rem] rounded-b-[2rem] shadow-2xl origin-bottom"
        >
          {/* Images with Cross Dissolve */}
          <AnimatePresence mode="popLayout">
            <motion.img 
                key={activeMode}
                src={activeMode === 'day' ? dayImage : nightImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={activeMode === 'day' ? "Day Setup" : "Night Setup"}
            />
          </AnimatePresence>

          {/* Overlay Gradient */}
          <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${activeMode === 'night' ? 'bg-black/30' : 'bg-transparent'}`} />

          {/* Floating Toggle Control */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
             <div className="flex bg-white/20 backdrop-blur-xl border border-white/30 p-1.5 rounded-full shadow-lg">
                <button 
                  onClick={() => setActiveMode('day')}
                  className="relative px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors duration-300 z-10 text-stone-900"
                >
                  {activeMode === 'day' && (
                    <motion.div 
                      layoutId="toggle-bg"
                      className="absolute inset-0 bg-white/90 shadow-sm rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Day Setup</span>
                </button>
                <button 
                  onClick={() => setActiveMode('night')}
                  className={`relative px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors duration-300 z-10 ${activeMode === 'night' ? 'text-stone-900' : 'text-stone-800'}`}
                >
                  {activeMode === 'night' && (
                    <motion.div 
                      layoutId="toggle-bg"
                      className="absolute inset-0 shadow-sm rounded-full"
                      style={{ backgroundColor: accentColor }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Night Setup</span>
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const Personalisation = () => {
  const { accentColor } = useTheme();
  return (
    <Section className="bg-[var(--card-bg)] backdrop-blur-md rounded-lg py-16 px-8 shadow-sm border border-[var(--card-border)]">
      <div className="text-center max-w-3xl mx-auto">
        <h3 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Bespoke Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
              <span>Custom bottle labels with couple names & date</span>
            </li>
            <li className="flex items-center space-x-3 text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
              <span>Optional signature scent created for the couple</span>
            </li>
          </ul>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
              <span>Wedding hashtag or monogram integration</span>
            </li>
            <li className="flex items-center space-x-3 text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
              <span>Luxury thank-you cards inside each package</span>
            </li>
          </ul>
        </div>
        <p className="mt-8 text-sm text-[var(--text-secondary)] italic">
          Packaging options include velvet pouches or rigid luxury boxes with gold detailing.
        </p>
      </div>
    </Section>
  );
};

const TierCard = ({ title, sub, features, recommended = false }: { title: string, sub: string, features: string[], recommended?: boolean }) => {
  const { accentColor } = useTheme();
  return (
    <div className={`relative p-8 border ${recommended ? 'bg-[var(--card-bg)] shadow-lg' : 'border-[var(--card-border)] bg-[var(--card-bg)]'} flex flex-col h-full transition-transform hover:-translate-y-1 duration-500`}
       style={recommended ? { borderColor: accentColor } : {}}
    >
      {recommended && (
        <span 
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px] uppercase tracking-widest py-1 px-3"
          style={{ backgroundColor: accentColor }}
        >
          Most Requested
        </span>
      )}
      <h4 className="font-serif text-2xl text-[var(--text-primary)] mb-2">{title}</h4>
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-6">{sub}</p>
      
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start">
            <span className="mr-2" style={{ color: accentColor }}>·</span> {f}
          </li>
        ))}
      </ul>
      
      <div className="text-center pt-6 border-t border-[var(--card-border)]">
        <span className="text-xs text-[var(--text-secondary)] italic">Pricing Curated Upon Request</span>
      </div>
    </div>
  );
};

const Tiers = () => (
  <Section id="tiers">
    <div className="text-center mb-16">
      <h3 className="font-serif text-4xl text-[var(--text-primary)] mb-4">Curated Experiences</h3>
      <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
        Designed to suit intimate gatherings or grand receptions.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TierCard 
        title="Silver" 
        sub="Scented Favours" 
        features={["Pre-filled bottles", "Custom labels", "Minimal setup"]} 
      />
      <TierCard 
        title="Gold" 
        sub="Signature Scent Bar" 
        features={["Live perfume booth", "Curated fragrance selection", "Attendant service", "Styled décor"]} 
        recommended={true}
      />
      <TierCard 
        title="Platinum" 
        sub="Couture Experience" 
        features={["Full luxury pop-up", "Custom lighting & branding", "Signature couple scent", "Premium packaging"]} 
      />
    </div>

    <p className="text-center mt-12 text-sm text-[var(--text-secondary)] italic max-w-2xl mx-auto">
      Pricing is intentionally not listed publicly. Each proposal is tailored based on guest count, personalization, and venue complexity to ensure exclusivity.
    </p>
  </Section>
);

const WhyUs = () => {
  const { accentColor } = useTheme();
  // We keep this section dark in both themes for contrast, but adjust inputs
  return (
    <Section className="bg-stone-900 text-ivory py-24 -mx-6 w-[calc(100%+3rem)] rounded-none md:rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <Heart className="w-8 h-8 mx-auto mb-4" style={{ color: accentColor }} />
          <h4 className="font-serif text-xl mb-3 text-ivory">Emotional Connection</h4>
          <p className="text-sm text-stone-400 leading-relaxed px-4">Create a deeper bond with your guests through the power of scent memory.</p>
        </div>
        <div>
          <Star className="w-8 h-8 mx-auto mb-4" style={{ color: accentColor }} />
          <h4 className="font-serif text-xl mb-3 text-ivory">Exclusive Luxury</h4>
          <p className="text-sm text-stone-400 leading-relaxed px-4">A sophisticated alternative to traditional favors, positioning your event as truly high-end.</p>
        </div>
        <div>
          <SparklesIcon className="w-8 h-8 mx-auto mb-4" style={{ color: accentColor }} />
          <h4 className="font-serif text-xl mb-3 text-ivory">Lasting Recall</h4>
          <p className="text-sm text-stone-400 leading-relaxed px-4">Long after the music stops, the fragrance remains as a tangible reminder of your joy.</p>
        </div>
      </div>
    </Section>
  );
};

const Footer = ({ onOpenContact }: { onOpenContact: () => void }) => (
  <footer className="bg-[var(--bg-primary)] border-t border-[var(--card-border)] pt-20 pb-10" id="contact">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="mb-12">
        <h2 className="font-serif text-4xl md:text-5xl text-[var(--text-primary)] mb-6">Begin Your Scent Journey</h2>
        <p className="font-sans text-[var(--text-secondary)] mb-8">
          Limited availability for the upcoming wedding season. <br />
          Invite us to curate a proposal for your celebration.
        </p>
        <div onClick={onOpenContact}>
          <Button>Request a Proposal</Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-[var(--card-border)] pt-8 mt-12">
        <div className="text-left mb-4 md:mb-0">
          <h5 className="font-serif text-lg text-[var(--text-primary)] tracking-wider">ZAP FRAGRANCE</h5>
          <p className="text-xs text-[var(--text-secondary)] mt-1">A Premium Sensory Experience.</p>
        </div>
        
        <div className="flex space-x-6 text-xs text-[var(--text-secondary)] uppercase tracking-widest">
          <span>Luxury Weddings</span>
          <span>•</span>
          <span>Destinations</span>
          <span>•</span>
          <span>Receptions</span>
        </div>
      </div>
      
      <div className="mt-8 text-[10px] text-stone-400">
        © {new Date().getFullYear()} ZAP Fragrance. All rights reserved.
      </div>
    </div>
  </footer>
);

// Wrapper Component to use Theme and Render Gate
const Content = () => {
  const [isContactOpen, setContactOpen] = useState(false);
  const handleOpenContact = () => setContactOpen(true);
  const { themeMode } = useTheme();

  return (
    <div className="relative min-h-screen text-[var(--text-primary)] bg-[var(--bg-primary)] transition-colors duration-1000">
      
      {/* Entry Gate - Only shows if mode is unset */}
      <AnimatePresence>
        {themeMode === 'unset' && (
           <motion.div 
             key="entry-gate"
             initial={{ opacity: 1 }}
             exit={{ opacity: 0, scale: 1.05 }}
             transition={{ duration: 0.8, ease: "easeInOut" }}
             className="fixed inset-0 z-[100]"
           >
             <EntryGate />
           </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: themeMode !== 'unset' ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Experience3D />
        <main className="relative z-0">
          <NavBar onOpenContact={handleOpenContact} />
          <Hero onOpenContact={handleOpenContact} />
          <Introduction />
          <GuestExperience />
          <Aesthetics />
          <Personalisation />
          <Tiers />
          <WhyUs />
          <Footer onOpenContact={handleOpenContact} />
        </main>
        <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
        <AdminPanel />
      </motion.div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
}
