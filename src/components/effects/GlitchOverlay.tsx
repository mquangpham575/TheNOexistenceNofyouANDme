/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generates a random stepped polygon path for glitch visual effect
const generatePixelatedPath = () => {
  const points = [];
  const steps = 4; // Adjustment: Higher = smoother path, Lower = blockier
  const segmentWidth = 100 / steps;

  // Top edge generation
  let x = 0;
  let y = Math.floor(Math.random() * 4) * 10; // Snap to 10% grid
  points.push(`${x}% ${y}%`);

  for (let i = 0; i < steps; i++) {
    x += segmentWidth;
    points.push(`${x}% ${y}%`); // Horizontal step
    y = Math.floor(Math.random() * 4) * 10; // New Y
    points.push(`${x}% ${y}%`); // Vertical step
  }

  // Bottom edge generation
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
  manualTrigger?: number; // Optional external trigger
  zIndex?: number;
}

// Renders visual glitch artifacts overlay with optional manual trigger
export default function GlitchOverlay({
  manualTrigger,
  zIndex = 5,
}: GlitchOverlayProps) {
  const [internalTrigger, setInternalTrigger] = useState(0);

  // Auto-trigger glitch effect if no manual trigger provided
  useEffect(() => {
    if (manualTrigger !== undefined) return;

    const interval = setInterval(() => {
      setInternalTrigger((prev) => prev + 1);
    }, 2000); // Adjustment: Auto-glitch frequency in ms

    return () => clearInterval(interval);
  }, [manualTrigger]);

  // Determine which trigger source to use
  const trigger = manualTrigger !== undefined ? manualTrigger : internalTrigger;

  return (
    <AnimatePresence>
      <motion.div
        key={`glitch-group-${trigger}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex }}
      >
        {[...Array(4)].map((_, i) => {
          // Generate customized glitch shards with random properties
          const widthPercent = 5 + Math.random() * 30; // Adjustment: Glitch width range
          const glitchColors = [
            "#FFFFFF", // White
            "#000000", // Black
            "#FF959E", // Pink
            "#DB404A", // Red
            "#505050", // Grey
          ];
          const color1 =
            glitchColors[Math.floor(Math.random() * glitchColors.length)];
          const color2 =
            glitchColors[Math.floor(Math.random() * glitchColors.length)];
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
                boxShadow: `0 0 0px ${color1}, 0 0 0px white`,
                zIndex: 1, // Adjustment: Layer order relative to other elements
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: [0, 0.9, 0],
                x: [-20, 20, 0],
                scaleY: [1, 1.5, 1],
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }} // Adjustment: Animation speed
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
