/**
 * CVScene3D.tsx - 3D Floating Documents Scene for CV Hub
 *
 * Renders animated 3D document-like shapes, torus knots, and particles
 * as a dramatic background for the CV Builder hub page.
 */
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  TorusKnot,
  Octahedron,
  Icosahedron,
  Sphere,
} from "@react-three/drei";
import * as THREE from "three";

function FloatingDocument({
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

  const lineColors = useMemo(() => [color, color, color, color], [color]);
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
        {/* Document body */}
        <mesh>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Border glow (wireframe via line segments) */}
        <mesh>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Text lines on document */}
        {lineColors.map((c, i) => (
          <mesh key={i} position={linePositions[i]}>
            <planeGeometry args={[lineWidths[i], 0.022]} />
            <meshStandardMaterial
              color={c}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function FloatingTorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.09;
    ref.current.rotation.y = state.clock.elapsedTime * 0.13;
  });
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <TorusKnot ref={ref} args={[0.45, 0.1, 100, 16]} position={[3.2, 0.5, -1]}>
        <MeshDistortMaterial
          color="#3b82f6"
          wireframe
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.28}
        />
      </TorusKnot>
    </Float>
  );
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
  });
  return (
    <Float speed={2.8} rotationIntensity={0.5} floatIntensity={2}>
      <Octahedron ref={ref} args={[0.6]} position={[-3.2, 1.2, -0.5]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          wireframe
          distort={0.3}
          speed={2}
          transparent
          opacity={0.32}
        />
      </Octahedron>
    </Float>
  );
}

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.3}>
      <Icosahedron ref={ref} args={[0.7, 1]} position={[2.5, -1.8, 0]}>
        <MeshDistortMaterial
          color="#06b6d4"
          wireframe
          distort={0.2}
          speed={1.8}
          transparent
          opacity={0.22}
        />
      </Icosahedron>
    </Float>
  );
}

function PulsingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    ref.current.scale.setScalar(s);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.8}>
      <Sphere ref={ref} args={[0.45, 32, 32]} position={[-2.5, -1.5, 0.5]}>
        <MeshDistortMaterial
          color="#10b981"
          distort={0.55}
          speed={2}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </Float>
  );
}

function ParticleCloud() {
  const count = 350;
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
      <pointsMaterial
        size={0.022}
        color="#60a5fa"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

const CVScene3D = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 58 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
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
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CVScene3D;
