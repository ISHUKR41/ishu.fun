/**
 * GlobeScene3D.tsx - Interactive 3D Globe Visualization
 *
 * Performance: Uses frameloop="demand" + IntersectionObserver to pause when offscreen.
 * All sub-components wrapped in React.memo.
 */

import { useRef, useMemo, Suspense, memo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

function useKeepAlive() {
  const { invalidate } = useThree();
  useFrame(() => invalidate());
}

const GlobeWireframe = memo(function GlobeWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <Sphere ref={ref} args={[1.8, 32, 32]}>
      <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.08} />
    </Sphere>
  );
});

const GlobeGlow = memo(function GlobeGlow() {
  return (
    <Sphere args={[1.85, 32, 32]}>
      <MeshDistortMaterial color="#3b82f6" distort={0.15} speed={1.5} transparent opacity={0.05} />
    </Sphere>
  );
});

const OrbitalRing = memo(function OrbitalRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.PI / 3;
  });
  return (
    <Torus ref={ref} args={[radius, 0.01, 8, 64]}>
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </Torus>
  );
});

const StateDots = memo(function StateDots() {
  const count = 36;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.82;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

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
});

const PulsingCore = memo(function PulsingCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    ref.current.scale.setScalar(scale);
  });
  return (
    <Sphere ref={ref} args={[0.15, 16, 16]}>
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
    </Sphere>
  );
});

function SceneContent() {
  useKeepAlive();
  return (
    <>
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
    </>
  );
}

const GlobeScene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-[400px] w-full md:h-[500px]">
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default GlobeScene3D;
