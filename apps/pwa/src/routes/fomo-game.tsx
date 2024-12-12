import WoodenFishIcon from "@/assets/wooden-fish-icon";
import "./pump-game.css";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { MintMemeButton } from "@/components/MintMemeButton";
import { Canvas, useFrame } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import { OrbitControls, useGLTF } from "@react-three/drei";
const demoSheet = getProject("Demo Project").sheet("Demo Sheet");

function Bonk({
  isRotating,
  setIsShowMint,
}: {
  isRotating: boolean;
  setIsShowMint: Dispatch<SetStateAction<boolean>>;
}) {
  const { nodes } = useGLTF("/cartoon_bonk.glb");
  const groupRef = useRef<any>();
  const [elapsedTime, setElapsedTime] = useState(0);
  // Rotate the model 360 degrees over 3 seconds
  const duration = 3;

  useFrame((_, delta) => {
    if (isRotating) {
      if (elapsedTime < duration) {
        setElapsedTime((prevTime) => prevTime + delta);

        const remainingTime = duration - elapsedTime;
        const velocity =
          ((10 * Math.PI) / duration) * (remainingTime / duration);

        if (groupRef.current) {
          groupRef.current.rotation.y += velocity * delta;
        }
      } else {
        // Stop the rotation at [0, 3, 0]
        if (groupRef.current) {
          groupRef.current.rotation.set(0, 3, 0);
        }
        setIsShowMint(true);
      }
    }
  });
  return (
    <group ref={groupRef} dispose={null} rotation={[0, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        //@ts-ignore
        geometry={nodes.mesh_0.geometry}
        //@ts-ignore
        material={nodes.mesh_0.material}
      />
    </group>
  );
}

function Stick({ position }: { position: number }) {
  const { nodes, materials } = useGLTF("/cartoon_stick.glb");
  const rotation = 2.1 + (position / 100) * (3.2 - 2.1);
  return (
    <group dispose={null} position={[-0.8, 0, 0.02]}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          //@ts-ignore
          geometry={nodes.MOD_STICK_hatlas_0.geometry}
          material={materials.hatlas}
          rotation={[1, rotation, 0]}
          scale={[2, 2, 2]}
        />
      </group>
    </group>
  );
}

export default function FomoGame() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isShowMint, setIsShowMint] = useState(false);
  const velocity = useRef(0);
  const lastBounceTime = useRef(0);
  const gravity = 0.9;
  const bounceVelocity = 15; // Upward velocity during bounce
  const [isRotating, setIsRotating] = useState(false);
  console.log("isShowMint", isShowMint);
  useEffect(() => {
    let motionListener: any;
    if (isRunning) {
      motionListener = (event: DeviceMotionEvent) => {
        const zTilt = event.accelerationIncludingGravity?.z || 0;
        const currentTime = Date.now();

        if (
          zTilt > 9.5 &&
          position === 0 &&
          currentTime - lastBounceTime.current >= 100
        ) {
          // Trigger bounce
          velocity.current = bounceVelocity;
          lastBounceTime.current = currentTime;
          setScore((prev) => prev + 1);
        }
      };

      // Listen to device motion events
      window.addEventListener("devicemotion", motionListener);
    }

    return () => {
      if (motionListener)
        window.removeEventListener("devicemotion", motionListener);
    };
  }, [isRunning, position]);

  // Update position
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft !== 0) {
      interval = setInterval(() => {
        setPosition((prevPosition) => {
          let newVelocity = velocity.current - gravity;
          let newPosition = prevPosition + newVelocity;

          if (newPosition <= 0) {
            newPosition = 0;
            velocity.current = 0;
          } else {
            velocity.current = newVelocity;
          }

          return newPosition;
        });
      }, 16); // Approximately 60fps
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isRotating]);

  // Timer
  useEffect(() => {
    let timer: any;
    if (isRunning) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        // setIsRunning(false);
        clearInterval(timer);
        setIsRotating(true);
        // setIsShowMint(true);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startGame = () => {
    setTimeLeft(5);
    setScore(0); // Reset score
    setPosition(0); // Reset ball position
    velocity.current = 0; // Reset velocity
    lastBounceTime.current = 0; // Reset last bounce time
    setIsRunning(true); // Start the game
  };

  useEffect(() => {
    demoSheet.project.ready.then(() =>
      demoSheet.sequence.play({ iterationCount: Infinity, range: [0, 1] }),
    );
  }, []);

  return (
    <div className="relative h-full w-full items-center justify-center">
      {isShowMint ? (
        <div className="justify-cente flex h-full w-full flex-col items-center">
          <MintMemeButton
            className="absolute left-1/2 top-40 mx-auto w-fit -translate-x-1/2 bg-black px-8 text-center text-lg font-bold"
            amount={10 ** 9}
            receiver="0xabcd"
            tokenAddr="0xabc"
          />
          <div className="absolute bottom-10 h-40 w-40">
            <WoodenFishIcon className="h-full w-full fill-white" />
          </div>
        </div>
      ) : isRunning ? (
        <>
          <div className="text-4xl">Metric Points: {score}</div>
          <div className="text-4xl">Time Left: {timeLeft}</div>
          <div className="absolute bottom-10 left-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2">
            <Canvas
              className="absolute h-full w-full"
              camera={{
                position: [0, 0, 12],
                fov: 10,
              }}
            >
              {/* Add lights */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />

              {/* Add the model */}
              {<Bonk isRotating={isRotating} setIsShowMint={setIsShowMint} />}
              <Stick position={position} />

              {/* Add camera controls */}
              <OrbitControls />
            </Canvas>
            <WoodenFishIcon className="h-full w-full fill-white" />
          </div>
        </>
      ) : (
        <div className="justify-cente flex h-full w-full flex-col items-center">
          <h1 className="organic-text mt-[20vh] text-[56px] text-white">
            Fomo
          </h1>

          <p className="mt-4 max-w-60 text-center text-subtitle text-sub-text">
            Hit your wooden fish as much as possible to gain merit points
            <br />
          </p>
          <Button className="mx-auto mt-4" onClick={startGame}>
            Start
          </Button>
          <div className="absolute bottom-10 h-40 w-40">
            <WoodenFishIcon className="h-full w-full fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}
