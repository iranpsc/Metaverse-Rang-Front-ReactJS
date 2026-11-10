// Interactive 3D FBX viewer: auto-fits, centers the model in the canvas and rotates it; used for model previews inside modals.
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useFBX } from "@react-three/drei";

const Model = ({ link }) => <primitive object={useFBX(link)} />;

const ModelSkeleton = () => (
  <group>
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#a0a0a0" transparent opacity={0.45} />
    </mesh>
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[0.5, 1.2, 0.5]} />
      <meshStandardMaterial color="#a0a0a0" transparent opacity={0.3} />
    </mesh>
  </group>
);

const CanvasPreview = ({ link }) => (
  <Canvas camera={{ position: [0, 0, 5], near: 0.1, far: 100000 }}>
    <ambientLight />
    <hemisphereLight args={["#ffffff", "#60666C"]} />
    <OrbitControls
      makeDefault
      autoRotate
      autoRotateSpeed={2}
      enablePan={false}
      maxPolarAngle={Math.PI / 2}
    />
    <Suspense fallback={<ModelSkeleton />}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <Model link={link} />
        </Center>
      </Bounds>
    </Suspense>
  </Canvas>
);

export default CanvasPreview;