"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

// Custom hook to manage window dimensions
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export const ConfettiProvider = () => {
  const { width, height } = useWindowDimensions();
  const confetti = useConfettiStore();

  // Return null if confetti is not open
  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100] w-full"
      width={width}
      height={height}
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={confetti.onClose}
    />
  );
};
