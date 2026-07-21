import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";

function GoldOrb() {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh position={[1.8, 0.2, 0]} scale={1.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#c9a34a"
          emissive="#3a2a08"
          roughness={0.25}
          metalness={0.7}
          distort={0.35}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 5]} intensity={2.2} color="#f0dda4" />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#c9a34a" />
        <GoldOrb />
        <Sparkles count={90} scale={[10, 6, 4]} size={2.2} speed={0.35} color="#e6c87d" opacity={0.6} />
      </Canvas>
    </div>
  );
}
