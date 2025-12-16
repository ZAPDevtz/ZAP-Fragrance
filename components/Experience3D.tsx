import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fix for TypeScript errors where R3F elements are not recognized in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

// Augment the React module to support R3F elements in newer React/TS configurations
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

// A fluid gold sphere representing the "essence" or "liquid" of perfume
const FluidEssence = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Get scroll position for interaction
      // Note: Ideally useScroll from drei in a ScrollControls wrapper, but accessing window directly 
      // keeps the DOM structure simple and works for this background effect.
      const scrollY = window.scrollY;
      const scrollSpeed = 0.001;

      // Rotate based on time AND scroll
      meshRef.current.rotation.x = (t * 0.1) + (scrollY * 0.0005);
      meshRef.current.rotation.y = (t * 0.15) + (scrollY * scrollSpeed);
      
      // Slight vertical parallax movement inverted to scroll
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.1 - (scrollY * 0.001);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#D4AF37" // Gold
          attach="material"
          distort={0.4} // Strength of distortion
          speed={2} // Speed of distortion
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
};

const AmbientParticles = () => {
  return (
    <Sparkles 
      count={150} 
      scale={12} 
      size={4} 
      speed={0.4} 
      opacity={0.6}
      color="#F0E3B6"
    />
  );
};

const Experience3D: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 mix-blend-multiply">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FFF" />
        
        {/* Environment for realistic reflections on the gold liquid */}
        <Environment preset="city" />

        <FluidEssence />
        <AmbientParticles />
      </Canvas>
    </div>
  );
};

export default Experience3D;