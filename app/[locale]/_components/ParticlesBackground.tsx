"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "@/components/ui/particles";

interface ParticlesDemoProps {
  children: ReactNode;
}

export function ParticlesBackground({ children }: ParticlesDemoProps) {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <div>
      <span>
        {children}
      </span>
      <Particles
        className="absolute inset-0"
        quantity={300}
        ease={10}
        color={color}
        refresh
      />
    </div>
  );
}
