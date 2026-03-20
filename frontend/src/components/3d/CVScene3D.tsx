/**
 * CVScene3D.tsx - 3D Floating Documents Scene for CV Hub
 *
 * Performance: Uses frameloop="demand" + IntersectionObserver to pause when offscreen.
 * All sub-components wrapped in React.memo. Reduced particle count.
 */
import { useRef, useMemo, Suspense, memo, useState, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  TorusKnot,
  Octahedron,
  Icosahedron,
  Sphere,
} from "@react-three/drei";
import * as THREE from "three";
import { shouldUse3D } from "@/config/performance";

class Scene3DErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() { if (this.state.hasError) return null; return this.props.children; }
}

const IS_MOBILE = typeof window !== "undefined" && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

function useKeepAlive() {
  const { invalidate } = useThree();
  useFrame(() => invalidate());
}

const FloatingDocument = memo(function FloatingDocument({
  position,
  color,
  rotOffset = 0,
}: {
  position: [number, number, number];
  color: string;
  rotOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.35 + rotOffset) * 0.25;
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.2 + rotOffset) * 0.04;
  });

  const linePositions = useMemo<[number, number, number][]>(() => [
    [0, 0.28, 0.01],
    [0, 0.1, 0.01],
    [-0.04, -0.06, 0.01],
    [0, -0.22, 0.01],
  ], []);
  const lineWidths = useMemo(() => [0.44, 0.5, 0.36, 0.3], []);

  return (
    <Float speed={1.4} floatIntensity={1.1} rotationIntensity={0}>
      <group ref={groupRef} position={position}>
        <mesh>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial color={color} wireframe transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        {lineWidths.map((w, i) => (
          <mesh key={i} position={linePositions[i]}>
            <planeGeometry args={[w, 0.022]} />
            <meshStandardMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Float>
  );
});

const FloatingTorusKnot = memo(function FloatingTorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.09;
    ref.current.rotation.y = state.clock.elapsedTime * 0.13;
  });
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <TorusKnot ref={ref} args={[0.45, 0.1, IS_MOBILE ? 32 : 64, IS_MOBILE ? 8 : 12]} position={[3.2, 0.5, -1]}>
        <MeshDistortMaterial color="#3b82f6" wireframe distort={0.15} speed={1.5} transparent opacity={0.28} />
      </TorusKnot>
    </Float>
  );
});

const FloatingOctahedron = memo(function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
  });
  return (
    <Float speed={2.8} rotationIntensity={0.5} floatIntensity={2}>
      <Octahedron ref={ref} args={[0.6]} position={[-3.2, 1.2, -0.5]}>
        <MeshDistortMaterial color="#8b5cf6" wireframe distort={0.3} speed={2} transparent opacity={0.32} />
      </Octahedron>
    </Float>
  );
});

const FloatingIcosahedron = memo(function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.3}>
      <Icosahedron ref={ref} args={[0.7, 1]} position={[2.5, -1.8, 0]}>
        <MeshDistortMaterial color="#06b6d4" wireframe distort={0.2} speed={1.8} transparent opacity={0.22} />
      </Icosahedron>
    </Float>
  );
});

const PulsingSphere = memo(function PulsingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    ref.current.scale.setScalar(s);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.8}>
      <Sphere ref={ref} args={[0.45, 16, 16]} position={[-2.5, -1.5, 0.5]}>
        <MeshDistortMaterial color="#10b981" distort={0.55} speed={2} transparent opacity={0.15} />
      </Sphere>
    </Float>
  );
});

const ParticleCloud = memo(function ParticleCloud() {
  const count = IS_MOBILE ? 80 : 200;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#60a5fa" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
});

function SceneContent() {
  useKeepAlive();
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.35} />
      <pointLight position={[-4, 3, 2]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[4, -2, -2]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#06b6d4" />

      <FloatingDocument position={[-3.8, 0.6, 0]} color="#3b82f6" rotOffset={0} />
      <FloatingDocument position={[3.8, -0.4, -0.5]} color="#8b5cf6" rotOffset={1.1} />
      <FloatingDocument position={[-2.2, -1.8, -1]} color="#06b6d4" rotOffset={2.3} />
      <FloatingDocument position={[2.2, 2.1, -1]} color="#10b981" rotOffset={1.7} />
      <FloatingDocument position={[0.8, -2.5, -0.5]} color="#f59e0b" rotOffset={0.8} />

      <FloatingTorusKnot />
      <FloatingOctahedron />
      <FloatingIcosahedron />
      <PulsingSphere />
      <ParticleCloud />
    </>
  );
}

const CVScene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const enabled = shouldUse3D();

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[1]">
      {isVisible && (
        <Scene3DErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 58 }}
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
        </Scene3DErrorBoundary>
      )}
    </div>
  );
};

export default CVScene3D;
