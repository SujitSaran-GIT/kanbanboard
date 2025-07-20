import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Custom material for gradient animation
const GradientMaterial = () => {
  const uniforms = useRef({
    time: { value: 0 },
    gradientColors: {
      value: [
        new THREE.Color('#ffbe0b'),
        new THREE.Color('#fb5607'),
        new THREE.Color('#ff006e'),
        new THREE.Color('#8338ec'),
        new THREE.Color('#3a86ff'),
        new THREE.Color('#ffbe0b')
      ]
    }
  });

  useFrame((state) => {
    uniforms.current.time.value = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <shaderMaterial
      attach="material"
      uniforms={uniforms.current}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform vec3 gradientColors[6];
        varying vec2 vUv;
        
        void main() {
          float gradientPos = fract(time + vUv.x * 0.5);
          int colorIndex = int(mod(gradientPos * 6.0, 6.0));
          int nextColorIndex = int(mod(float(colorIndex + 1), 6.0));
          float blend = fract(gradientPos * 6.0);
          
          vec3 color = mix(
            gradientColors[colorIndex], 
            gradientColors[nextColorIndex], 
            blend
          );
          
          gl_FragColor = vec4(color, 0.15); // Lower opacity for background
        }
      `}
      transparent
      depthWrite={false}
    />
  );
};

const AnimatedSphere = ({ position, speed = 1, size = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.2;
    
    // Pulsing effect
    const scale = 1 + Math.sin(time * speed * 0.5) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <GradientMaterial />
    </Sphere>
  );
};

const ThreeBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Main animated spheres */}
      <AnimatedSphere position={[-4, 0, 0]} speed={0.6} size={2.5} />
      <AnimatedSphere position={[4, 0, 0]} speed={0.8} size={2} />
      <AnimatedSphere position={[0, 3, -2]} speed={0.5} size={1.8} />
      <AnimatedSphere position={[0, -3, -1]} speed={0.7} size={1.5} />
      
      {/* Additional smaller floating spheres */}
      <AnimatedSphere position={[-2, -2, 1]} speed={0.4} size={0.8} />
      <AnimatedSphere position={[3, 2, 0]} speed={0.9} size={0.6} />
      
      {/* Subtle auto-rotation */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.3}
        rotateSpeed={0.5}
      />
    </Canvas>
  </div>
);

export default ThreeBackground;