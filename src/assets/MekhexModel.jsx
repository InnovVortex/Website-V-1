import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Mekhex() {
  const { scene } = useGLTF("/models/mekhex.glb");

  return (
    <primitive
      object={scene}
      scale={8}
      position={[0, -1, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
}

export default function MekhexModel() {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
      <Stage environment="city" intensity={1}>
        <Mekhex />
      </Stage>

      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
}