// Interactive 3D FBX viewer: auto-fits, centers the model in the canvas and rotates it; used for model previews inside modals.
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useFBX } from "@react-three/drei";

const Model = ({ link }) => <primitive object={useFBX(link)} />;

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
    <Suspense fallback={null}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <Model link={link} />
        </Center>
      </Bounds>
    </Suspense>
  </Canvas>
);

export default CanvasPreview;