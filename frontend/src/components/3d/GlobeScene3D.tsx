/**
 * GlobeScene3D.tsx - Interactive 3D Globe Visualization
 * 
 * Renders a wireframe globe with animated dots (representing Indian states),
 * orbital rings, and a pulsing center core. Used in the StatesMapSection
 * to visually represent pan-India coverage.
 * 
 * Components inside:
 * - GlobeWireframe: Slowly rotating wireframe sphere
 * - GlobeGlow: Soft glowing outer shell with distortion effect
 * - OrbitalRing: Thin rings orbiting the globe (like Saturn's rings)
 * - StateDots: Random dots on the globe surface (representing states)
 * - PulsingCore: Small glowing sphere at the center that pulses
 * 
 * Uses @react-three/fiber for 3D rendering and @react-three/drei for helpers.
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

/** Wireframe sphere that slowly rotates - the main globe shape */
function GlobeWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;  // Slow Y-axis rotation
  });
  return (
    <Sphere ref={ref} args={[1.8, 32, 32]}>
      <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.08} />
    </Sphere>
  );
}

/** Soft glowing outer shell with organic distortion */
function GlobeGlow() {
  return (
    <Sphere args={[1.85, 32, 32]}>
      <MeshDistortMaterial
        color="#3b82f6"
        distort={0.15}          // Amount of surface distortion
        speed={1.5}             // Speed of distortion animation
        transparent
        opacity={0.05}
      />
    </Sphere>
  );
}

/** Thin ring orbiting the globe at an angle */
function OrbitalRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.PI / 3;  // Tilt the ring at 60 degrees
  });
  return (
    <Torus ref={ref} args={[radius, 0.01, 8, 64]}>
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </Torus>
  );
}

/** Random dots distributed on the globe surface (representing states/cities) */
function StateDots() {
  const count = 36;  // 36 dots for 36 states & UTs
  const ref = useRef<THREE.Points>(null);

  // Generate random positions on a sphere surface
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Use spherical coordinates for even distribution
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.82;  // Slightly larger than globe radius to sit on surface
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // Rotate dots with the globe
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#60a5fa" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

/** Small pulsing sphere at the center of the globe */
function PulsingCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Gentle scale pulsing effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    ref.current.scale.setScalar(scale);
  });
  return (
    <Sphere ref={ref} args={[0.15, 16, 16]}>
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
    </Sphere>
  );
}

/** Main Globe Scene - combines all 3D elements in a Canvas */
const GlobeScene3D = () => {
  return (
    <div className="h-[400px] w-full md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[-5, -5, 5]} intensity={0.3} color="#8b5cf6" />

          <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group>
              <GlobeWireframe />
              <GlobeGlow />
              <StateDots />
              <PulsingCore />
              <OrbitalRing radius={2.5} speed={0.15} color="#3b82f6" />
              <OrbitalRing radius={2.8} speed={-0.1} color="#8b5cf6" />
            </group>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

// Export the component
export default GlobeScene3D;
