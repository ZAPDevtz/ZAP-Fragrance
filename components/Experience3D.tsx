import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Fix for TypeScript errors where R3F elements are not recognized in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      cylinderGeometry: any;
      planeGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      group: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
    }
  }
}

const PerfumeBottle = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      const scrollY = window.scrollY;
      
      // Scale down and fade out as user scrolls away from Hero
      const maxScroll = window.innerHeight * 0.8; 
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const scale = 1 - progress; 
      
      if (scale <= 0) {
          group.current.visible = false;
      } else {
          group.current.visible = true;
          // Smooth scale and move down
          group.current.scale.setScalar(scale * 1.2); 
          group.current.position.y = -progress * 2; 
          
          // Gentle luxury rotation
          group.current.rotation.y = Math.sin(t * 0.2) * 0.3;
          group.current.rotation.x = Math.sin(t * 0.3) * 0.05;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      <group ref={group} position={[0, 0, 0]}>
        
        {/* -- BOTTLE BODY (Glass) -- */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.8, 2.5, 64]} />
            <meshPhysicalMaterial 
                color="#FFFFF0" 
                transmission={0.95} 
                opacity={1} 
                metalness={0.1} 
                roughness={0.05} 
                thickness={2} 
                ior={1.5}
                clearcoat={1}
            />
        </mesh>
        
        {/* -- LIQUID INSIDE -- */}
        <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 1.8, 64]} />
            <meshStandardMaterial 
                color="#D4AF37" 
                metalness={0.4} 
                roughness={0.2} 
                opacity={0.8}
                transparent
            />
        </mesh>

        {/* -- NECK -- */}
        <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
            <meshStandardMaterial 
                color="#AA8C2C" 
                metalness={1} 
                roughness={0.2} 
            />
        </mesh>

        {/* -- CAP -- */}
        <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.7, 64]} />
             <meshStandardMaterial 
                color="#D4AF37"
                metalness={1} 
                roughness={0.1} 
            />
        </mesh>

        {/* -- LABEL -- */}
        {/* Base dark label */}
        <mesh position={[0, -0.5, 0.75]}>
             <planeGeometry args={[0.8, 1.2]} />
             <meshStandardMaterial color="#1C1917" />
        </mesh>
        {/* Inner contrast */}
        <mesh position={[0, -0.5, 0.76]}>
             <planeGeometry args={[0.6, 1]} />
             <meshStandardMaterial color="#292524" />
        </mesh>
        {/* Gold Accent Strip */}
        <mesh position={[0, -0.5, 0.77]}>
             <planeGeometry args={[0.4, 0.05]} />
             <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
        </mesh>

      </group>
    </Float>
  );
};

const AmbientParticles = () => {
  return (
    <Sparkles 
      count={80} 
      scale={10} 
      size={3} 
      speed={0.4} 
      opacity={0.5}
      color="#F0E3B6"
    />
  );
};

const Experience3D: React.FC = () => {
  const { themeMode } = useTheme();
  
  // Adjust blending based on theme
  // Day: mix-blend-multiply helps integrate into white background
  // Night: mix-blend-screen or normal helps it stand out against dark background
  const blendMode = themeMode === 'night' ? 'normal' : 'mix-blend-multiply';
  const opacity = themeMode === 'night' ? 'opacity-80' : 'opacity-60';

  return (
    <div className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${opacity} ${blendMode} transition-all duration-1000`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFF" />
        
        {/* Environment for realistic gold reflections */}
        <Environment preset="city" />

        <PerfumeBottle />
        <AmbientParticles />
      </Canvas>
    </div>
  );
};

export default Experience3D;