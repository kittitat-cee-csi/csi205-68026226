"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { checklogin } from "@/utils/login";
import { Button } from "@/components/tailgrids/core/button";

interface AnimationProps {
  fieldWidth?: number;
  fieldHeight?: number;
  ballRadius?: number;
  velocity?: number;
  keyEvent?: { code: string } | null;
}

function AnimationGame({
  fieldWidth = 680,
  fieldHeight = 520,
  ballRadius = 50,
  velocity = 300,
  keyEvent = null,
}: AnimationProps) {
  const ballDiameter = 2 * ballRadius;
  const vx = Math.round(velocity * Math.sqrt(2));
  const vy = Math.round(velocity * Math.sqrt(2));
  const maxX = fieldWidth - ballDiameter - 2;
  const maxY = fieldHeight - ballDiameter - 2;

  const ballRef = useRef<HTMLDivElement>(null);
  const [ballType, setBallType] = useState<string>("none");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [movingRight, setMovingRight] = useState<boolean>(true);
  const [movingDown, setMovingDown] = useState<boolean>(true);
  const [posX, setPosX] = useState<number>(2);
  const [posY, setPosY] = useState<number>(2);
  const [rotation, setRotation] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    if (keyEvent) {
      if (keyEvent.code === "Space") setIsPlaying((prev) => !prev);
      if (keyEvent.code === "Digit0") setBallType("none");
      if (keyEvent.code === "Digit1") setBallType("basketball");
      if (keyEvent.code === "Digit2") setBallType("football");
      if (keyEvent.code === "Digit3") setBallType("volleyball");
      if (keyEvent.code === "Digit4") setBallType("face");
    }
  }, [keyEvent]);

  // Main animation step
  const step = () => {
    let newX: number;
    let newY: number;

    if (movingRight) {
      newX = posX + vx / 25;
      if (newX >= maxX) {
        newX = maxX - (newX - maxX);
        setMovingRight(false);
      }
    } else {
      newX = posX - vx / 25;
      if (newX <= 2) {
        newX = -newX;
        setMovingRight(true);
      }
    }
    setPosX(newX);

    if (movingDown) {
      newY = posY + vy / 25;
      if (newY >= maxY) {
        newY = maxY - (newY - maxY);
        setMovingDown(false);
      }
    } else {
      newY = posY - vy / 25;
      if (newY <= 2) {
        newY = -newY;
        setMovingDown(true);
      }
    }
    setPosY(newY);
  };

  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current === null) {
        timerRef.current = setTimeout(() => {
          step();
          timerRef.current = null;
        }, 40);
      }
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  });

  // Rotation when bouncing
  useEffect(() => {
    setRotation((r) => r + (Math.random() + 1) * 100);
  }, [movingRight, movingDown]);

  // Continuous subtle rotation while playing
  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => {
      setRotation((r) => r + Math.floor(Math.random()) + 10);
    }, 40);
    return () => clearTimeout(t);
  }, [isPlaying, rotation]);

  // Update ball appearance
  useEffect(() => {
    const el = ballRef.current;
    if (!el) return;

    el.style.backgroundColor = "";
    if (ballType === "none") {
      el.style.backgroundImage = "";
      el.style.backgroundColor = "lightgray";
    } else if (ballType === "basketball") {
      el.style.backgroundImage = `url('/assets/basketball.jpg')`;
    } else if (ballType === "football") {
      el.style.backgroundImage = `url('/assets/football.png')`;
    } else if (ballType === "volleyball") {
      el.style.backgroundImage = `url('/assets/volleyball.png')`;
    } else if (ballType === "face") {
      el.style.backgroundImage = `url('/assets/kittitat.gif')`;
    }
  }, [ballType]);

  return (
    <div className="mx-auto mb-5" style={{ width: `${fieldWidth}px` }}>
      {/* Field & Ball */}
      <div className="relative">
        <div
          className="mt-4 mx-auto border-2 border-black rounded-lg overflow-hidden"
          style={{
            width: `${fieldWidth}px`,
            height: `${fieldHeight}px`,
            backgroundImage: `url('/assets/field.jpg')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div
          ref={ballRef}
          className="rounded-[100%] absolute border border-black/30 shadow-md"
          style={{
            width: `${ballDiameter}px`,
            height: `${ballDiameter}px`,
            left: `${posX}px`,
            top: `${posY}px`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Controls Bar */}
      <div className="mt-3 flex items-center justify-between">
        {/* Play / Pause button */}
        <div>
          <Button
            variant={!isPlaying ? "success" : "danger"}
            size="lg"
            appearance="fill"
            onClick={() => setIsPlaying(!isPlaying)}
            className="cursor-pointer"
          >
            {isPlaying ? (
              <div className="flex items-center gap-1">
                <span>⏸</span>
                <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>▶</span>
                <span>Play</span>
              </div>
            )}
          </Button>
        </div>

        {/* Ball Selection Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="primary"
            size="lg"
            appearance={ballType === "none" ? "fill" : "outline"}
            onClick={() => setBallType("none")}
            className="cursor-pointer"
          >
            None
          </Button>
          <Button
            variant="primary"
            size="lg"
            appearance={ballType === "basketball" ? "fill" : "outline"}
            onClick={() => setBallType("basketball")}
            className="cursor-pointer"
          >
            Basketball
          </Button>
          <Button
            variant="primary"
            size="lg"
            appearance={ballType === "football" ? "fill" : "outline"}
            onClick={() => setBallType("football")}
            className="cursor-pointer"
          >
            Football
          </Button>
          <Button
            variant="primary"
            size="lg"
            appearance={ballType === "volleyball" ? "fill" : "outline"}
            onClick={() => setBallType("volleyball")}
            className="cursor-pointer"
          >
            Volleyball
          </Button>
          <Button
            variant="primary"
            size="lg"
            appearance={ballType === "face" ? "fill" : "outline"}
            onClick={() => setBallType("face")}
            className="cursor-pointer"
          >
            Face
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AnimationPage() {
  const router = useRouter();

  useEffect(() => {
    checklogin(router, "/animation");
  }, [router]);

  const [keyEvent, setKeyEvent] = useState<{ code: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyEvent({ code: e.code });
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <AnimationGame keyEvent={keyEvent} />;
}
