/**
 * ToolsScene3D.tsx - 3D Scene for Tools Page
 * 
 * Renders a decorative 3D background for the Tools page hero section.
 * Shows floating document shapes, a rotating gear (torus), a central orb,
 * and scattered connector particles.
 * 
 * Components:
 * - ToolGear: Rotating hexagonal torus (represents tools/gears)
 * - FloatingDoc: Small rectangular shapes floating around (represent documents)
 * - CentralOrb: Pulsing distorted sphere in the center
 * - ConnectorLines: Scattered particles creating a network effect
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

/** Rotating hexagonal torus - looks like a gear or tool icon */
function ToolGear() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Torus ref={ref} args={[1, 0.2, 6, 6]}>
        <MeshDistortMaterial
          color="#3b82f6"
          wireframe
          distort={0.1}
          speed={2}
          transparent
          opacity={0.3}
        />
      </Torus>
    </Float>
  );
}

/** Small floating rectangle - represents a document/file */
function FloatingDoc({ position, color }: { position: [number, number, number]; color: string }) {
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
}

/** Pulsing icosahedron (20-sided sphere) at the center */
function CentralOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Gentle breathing/pulsing scale effect
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.1);
  });
  return (
    <Icosahedron ref={ref} args={[0.4, 2]}>
      <MeshDistortMaterial
        color="#3b82f6"
        distort={0.4}
        speed={3}
        transparent
        opacity={0.15}
      />
    </Icosahedron>
  );
}

/** Scattered particles that slowly rotate - creates a network/constellation effect */
function ConnectorLines() {
  const ref = useRef<THREE.Points>(null);
  const count = 30;
  
  // Generate random positions in a 6x4x3 box
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
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;  // Very slow rotation
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#60a5fa" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/** Main Tools 3D Scene - overlays on top of the tools page hero */
const ToolsScene3D = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 1]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
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
        </Suspense>
      </Canvas>
    </div>
  );
};

// Export the component
export default ToolsScene3D;
