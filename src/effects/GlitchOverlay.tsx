import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for pixelated/stepped shapes
const generatePixelatedPath = () => {
    const points = [];
    const steps = 4; // Reduced steps for more pixelated look
    const segmentWidth = 100 / steps;

    // Top edge
    let x = 0;
    let y = Math.floor(Math.random() * 4) * 10; // Snap to 10% grid
    points.push(`${x}% ${y}%`);

    for (let i = 0; i < steps; i++) {
        x += segmentWidth;
        points.push(`${x}% ${y}%`); // Horizontal
        y = Math.floor(Math.random() * 4) * 10; // New Y
        points.push(`${x}% ${y}%`); // Vertical
    }

    // Bottom edge
    x = 100;
    y = 60 + Math.floor(Math.random() * 4) * 10;
    points.push(`${x}% ${y}%`);

    for (let i = 0; i < steps; i++) {
        x -= segmentWidth;
        points.push(`${x}% ${y}%`);
        y = 60 + Math.floor(Math.random() * 4) * 10;
        points.push(`${x}% ${y}%`);
    }

    return `polygon(${points.join(",")})`;
};

interface GlitchOverlayProps {
  manualTrigger?: number; // If provided, parent controls timing
  zIndex?: number;
}

export default function GlitchOverlay({ manualTrigger, zIndex = 5 }: GlitchOverlayProps) {
  const [internalTrigger, setInternalTrigger] = useState(0);

  // If manualTrigger is NOT provided, run internal timer
  useEffect(() => {
    if (manualTrigger !== undefined) return;

    const interval = setInterval(() => {
      setInternalTrigger((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [manualTrigger]);

  // Use manual trigger if available, otherwise internal
  const trigger = manualTrigger !== undefined ? manualTrigger : internalTrigger;

  return (
    <AnimatePresence>
      <motion.div
        key={`glitch-group-${trigger}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex }}
      >
        {[...Array(4)].map((_, i) => {
          const widthPercent = 5 + Math.random() * 30;
          const glitchColors = [
            "#FFFFFF", // White
            "#000000", // Black
            "#FF959E", // Pink
            "#DB404A", // Red
            "#505050", // Grey
          ];
          const color1 = glitchColors[Math.floor(Math.random() * glitchColors.length)];
          const color2 = glitchColors[Math.floor(Math.random() * glitchColors.length)];
          const angle = Math.floor(Math.random() * 360);

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * (100 - widthPercent)}%`,
                width: `${widthPercent}%`,
                height: `${2 + Math.random() * 20}px`,
                clipPath: generatePixelatedPath(),
                background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
                boxShadow: `0 0 0px ${color1}, 0 0 0px white`, // Removed blur
                zIndex: 1,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: [0, 0.9, 0],
                x: [-20, 20, 0],
                scaleY: [1, 1.5, 1],
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
