import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const styles = `
    @keyframes glow {
      0%, 100% {
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
        opacity: 0.85;
      }
      45%, 55% {
        text-shadow:
          0 0 4px white,
          0 -3px 6px rgba(255, 255, 255, 0.3);
        opacity: 1;
      }
    }

    .organic-text {
      display: inline-flex;
      gap: .5px;
    }

    .organic-text span {
      display: inline-block;
      animation: glow 3s ease-in-out infinite;
      transition: all 0.3s ease;
    }

    .organic-text span:nth-child(1) { animation-delay: 0.0s; }
    .organic-text span:nth-child(2) { animation-delay: 0.3s; }
    .organic-text span:nth-child(3) { animation-delay: 0.7s; }
    .organic-text span:nth-child(4) { animation-delay: 1.1s; }
    .organic-text span:nth-child(5) { animation-delay: 1.4s; }
    .organic-text span:nth-child(6) { animation-delay: 1.8s; }
    .organic-text span:nth-child(7) { animation-delay: 2.2s; }

    @keyframes float1 { 
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-0.5px); }
    }
    @keyframes float2 { 
      0%, 100% { transform: translateY(-0.5px); }
      50% { transform: translateY(0.5px); }
    }
    @keyframes float3 { 
      0%, 100% { transform: translateY(0.5px); }
      50% { transform: translateY(-0.7px); }
    }

    .organic-text span:nth-child(3n+1) {
      animation: glow 5s ease-in-out infinite, float1 4s ease-in-out infinite;
    }
    .organic-text span:nth-child(3n+2) {
      animation: glow 5s ease-in-out infinite, float2 3.5s ease-in-out infinite;
    }
    .organic-text span:nth-child(3n) {
      animation: glow 5s ease-in-out infinite, float3 4.5s ease-in-out infinite;
    }
  `;

export default function Start() {
  const navigate = useNavigate();

  const [isRequested, setIsRequired] = useState(false);

  const handleOnClick = async () => {
    if (!isRequested) {
      //@ts-ignore
      const permission = await window.DeviceMotionEvent.requestPermission();
      if (permission !== "granted") {
        toast("You must grant access to the device's sensor for this demo");
        return;
      }

      setIsRequired(true);
    } else {
      navigate("/game/pump");
    }
  };
  return (
    <div className="relative h-lvh w-full max-w-[338px] overflow-hidden px-4 pb-10 text-center">
      <style>{styles}</style>
      <div className="relative z-10 flex w-full flex-col items-center justify-center py-2">
        <h1 className="organic-text mt-[30vh] text-[56px] text-white">
          {"Ikkyu".split("").map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </h1>
        <h1 className="organic-text mb-4 text-[56px] text-white">
          {"Adventure".split("").map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </h1>

        <p className="mb-[20vh] max-w-80 text-subtitle text-sub-text">
          You're about to embark on a journey to experience the power of p2p
          social networks <br />
        </p>

        {
          //@ts-ignore
          window.DeviceMotionEvent?.requestPermission ? (
            <Button
              onClick={handleOnClick}
              variant="default"
              className="w-full"
            >
              {!isRequested ? "Click to request" : "Start"}
            </Button>
          ) : (
            <p className="mt-4 max-w-[280px] text-[13px] leading-snug text-sub-text">
              Your current device does not have access to the DeviceMotion event
            </p>
          )
        }
      </div>
    </div>
  );
}
