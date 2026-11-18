'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

/** Organic AI "core" — slowly morphing, with an orbiting wire shell. */
function AiCore() {
  const group = useRef();
  const orbit = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.28;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    }
    if (orbit.current) orbit.current.rotation.z -= delta * 0.18;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.05, 5]} />
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.55}
          metalness={0.75}
          roughness={0.15}
          distort={0.38}
          speed={1.6}
        />
      </mesh>

      <group ref={orbit}>
        <mesh scale={1.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#a5b4fc" wireframe transparent opacity={0.22} />
        </mesh>
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.75, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 1.75]}
            >
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** Stylised 3D trophy built from primitives — drag to rotate. */
function Trophy() {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  const gold = { color: '#fcd34d', metalness: 0.85, roughness: 0.2, emissive: '#f59e0b', emissiveIntensity: 0.4 };

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* cup */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.72, 0.34, 0.85, 40, 1, true]} />
        <meshStandardMaterial {...gold} side={2} />
      </mesh>
      {/* cup bottom */}
      <mesh position={[0, -0.08, 0]}>
        <sphereGeometry args={[0.35, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {/* rim */}
      <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.055, 12, 48]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {/* handles */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.7, 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.28, 0.05, 12, 32, Math.PI * 1.35]} />
          <meshStandardMaterial {...gold} />
        </mesh>
      ))}
      {/* stem + base */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.5, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.5, 0.58, 0.16, 32]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function Scene({ variant }) {
  return (
    <>
      {variant === 'trophy' ? (
        <>
          <ambientLight intensity={1.1} />
          <pointLight position={[2, 3, 4]} intensity={70} color="#fff7d6" />
          <pointLight position={[-3, 1, 2]} intensity={35} color="#fbbf24" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.7} />
          <pointLight position={[3, 3, 4]} intensity={40} color="#8b5cf6" />
          <pointLight position={[-3, -2, 2]} intensity={30} color="#22d3ee" />
        </>
      )}
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.5}>
        {variant === 'trophy' ? <Trophy /> : <AiCore />}
      </Float>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </>
  );
}

export default function Object3D({ variant = 'core', className = '' }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene variant={variant} />
      </Canvas>
    </div>
  );
}
