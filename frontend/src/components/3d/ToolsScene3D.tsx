/**
 * ToolsScene3D.tsx - 3D Scene for Tools Page
 *
 * Performance: Uses frameloop="demand" + IntersectionObserver to pause when offscreen.
 * All sub-components wrapped in React.memo.
 */

import { useRef, useMemo, Suspense, memo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

const IS_MOBILE = typeof window !== "undefined" && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

function useKeepAlive() {
  const { invalidate } = useThree();
  useFrame(() => invalidate());
}

const ToolGear = memo(function ToolGear() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Torus ref={ref} args={[1, 0.2, 6, 6]}>
        <MeshDistortMaterial color="#3b82f6" wireframe distort={0.1} speed={2} transparent opacity={0.3} />
      </Torus>
    </Float>
  );
});

const FloatingDoc = memo(function FloatingDoc({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.2}>
      <Box ref={ref} args={[0.5, 0.7, 0.05]} position={position}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
      </Box>
    </Float>
  );
});

const CentralOrb = memo(function CentralOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.1);
  });
  return (
    <Icosahedron ref={ref} args={[0.4, 2]}>
      <MeshDistortMaterial color="#3b82f6" distort={0.4} speed={3} transparent opacity={0.15} />
    </Icosahedron>
  );
});

const ConnectorLines = memo(function ConnectorLines() {
  const ref = useRef<THREE.Points>(null);
  const count = IS_MOBILE ? 50 : 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#60a5fa" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
});

function SceneContent() {
  useKeepAlive();
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#8b5cf6" />
      <ToolGear />
      <CentralOrb />
      <FloatingDoc position={[-2, 1, -0.5]} color="#3b82f6" />
      <FloatingDoc position={[2.2, -0.8, 0]} color="#8b5cf6" />
      <FloatingDoc position={[-1.5, -1.2, 0.5]} color="#06b6d4" />
      <FloatingDoc position={[1.8, 1.2, -0.3]} color="#10b981" />
      <ConnectorLines />
    </>
  );
}

const ToolsScene3D = () => {
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
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          frameloop="demand"
          dpr={[1, IS_MOBILE ? 1 : 1.5]}
          performance={{ min: 0.5 }}
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

export default ToolsScene3D;
