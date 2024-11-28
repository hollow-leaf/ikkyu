import { useState, useEffect } from "react";

type Motion = {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
};

export const useMotion = () => {
  const [motion, setMotion] = useState<Motion>();

  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      setMotion({
        acceleration: {
          x: e.acceleration?.x || 0,
          y: e.acceleration?.y || 0,
          z: e.acceleration?.z || 0,
        },
        accelerationIncludingGravity: {
          x: e.accelerationIncludingGravity?.x || 0,
          y: e.accelerationIncludingGravity?.y || 0,
          z: e.accelerationIncludingGravity?.z || 0,
        },
        rotationRate: {
          alpha: e.rotationRate?.alpha || 0,
          beta: e.rotationRate?.beta || 0,
          gamma: e.rotationRate?.gamma || 0,
        },
      });
    };
    window.addEventListener("devicemotion", handleMotion);

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return motion;
};
