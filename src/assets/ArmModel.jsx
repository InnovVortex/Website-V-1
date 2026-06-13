import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";

function Arm() {
  const { scene } = useGLTF("/models/ARM.glb");

  return (
    <primitive
      object={scene}
      scale={50}
      position={[0, -2, 0]}
      
    />
  );
}

export default function ArmModel() {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
      <Stage environment="city" intensity={1}>
        <Arm />
      </Stage>

      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
      />
    </Canvas>
  );
}