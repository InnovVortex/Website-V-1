import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Drone() {
  const { scene } = useGLTF("/drone.glb");

  return (
    <primitive
      object={scene}
      scale={15}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

export default function DroneModel() {
  return (
    <Canvas camera={{ position: [0, 1, 10], fov: 45 }}>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Drone />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
      />
    </Canvas>
  );
}