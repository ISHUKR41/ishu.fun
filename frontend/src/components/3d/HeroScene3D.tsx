/**
 * HeroScene3D.tsx - 3D Scene for Home Page Hero
 *
 * Renders animated 3D shapes as a background decoration for the hero section.
 * Performance: Uses frameloop="demand" + IntersectionObserver to pause when offscreen.
 * All sub-components wrapped in React.memo to prevent unnecessary re-renders.
 * Automatically disabled on mobile/low-end devices for optimal performance.
 */
import { useRef, useMemo, Suspense, memo, useState, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron, Octahedron, Box } from "@react-three/drei";
import * as THREE from "three";
import { shouldUse3D, SCENE_3D_CONFIG } from "@/config/performance";

// Local error boundary to silently catch WebGL/3D failures
class Scene3DErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const IS_MOBILE = typeof window !== "undefined" && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

function useKeepAlive() {
  const { invalidate } = useThree();
  useFrame(() => invalidate());
}

const FloatingIcosahedron = memo(function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <Icosahedron ref={ref} args={[1.2, 1]} position={[2.5, 0.5, 0]}>
        <MeshDistortMaterial color="#3b82f6" wireframe distort={0.3} speed={2} transparent opacity={0.4} />
      </Icosahedron>
    </Float>
  );
});

const FloatingTorus = memo(function FloatingTorus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <Torus ref={ref} args={[0.8, 0.25, 16, 32]} position={[-2.8, -0.5, -1]}>
        <MeshWobbleMaterial color="#8b5cf6" wireframe factor={0.4} speed={1.5} transparent opacity={0.35} />
      </Torus>
    </Float>
  );
});

const FloatingOctahedron = memo(function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={2}>
      <Octahedron ref={ref} args={[0.7]} position={[-1.5, 1.5, -0.5]}>
        <MeshDistortMaterial color="#06b6d4" wireframe distort={0.2} speed={3} transparent opacity={0.3} />
      </Octahedron>
    </Float>
  );
});

const GlowingSphere = memo(function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <Sphere ref={ref} args={[0.5, 16, 16]} position={[1.5, -1.5, 0.5]}>
        <MeshDistortMaterial color="#3b82f6" distort={0.5} speed={2} transparent opacity={0.2} />
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
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#3b82f6" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
});

const FloatingBox = memo(function FloatingBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2}>
      <Box ref={ref} args={[0.6, 0.6, 0.6]} position={[3, -1, -1]}>
        <MeshWobbleMaterial color="#10b981" wireframe factor={0.3} speed={1} transparent opacity={0.25} />
      </Box>
    </Float>
  );
});

function SceneContent() {
  useKeepAlive();
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[3, -2, -2]} intensity={0.3} color="#8b5cf6" />
      <FloatingIcosahedron />
      <FloatingTorus />
      <FloatingOctahedron />
      <GlowingSphere />
      <FloatingBox />
      <ParticleCloud />
    </>
  );
}

const HeroScene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [contextLost, setContextLost] = useState(false);
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
      {isVisible && !contextLost && (
        <Scene3DErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            dpr={[1, IS_MOBILE ? 1 : 1.5]}
            performance={{ min: 0.5 }}
            gl={{ antialias: SCENE_3D_CONFIG.antialias, alpha: true, powerPreference: "default" }}
            style={{ background: "transparent" }}
            frameloop={SCENE_3D_CONFIG.frameloop}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              const handleContextLost = (e: Event) => {
                e.preventDefault();
                setContextLost(true);
                setTimeout(() => setContextLost(false), 2000);
              };
              canvas.addEventListener("webglcontextlost", handleContextLost);
              return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
            }}
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

export default HeroScene3D;
