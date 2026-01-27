import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for jagged shapes
const generateSharpPath = () => {
    const points = [];
    const segments = 12;
    points.push("0% 20%");
    for (let j = 1; j < segments; j++) {
      const x = (j / segments) * 100;
      const y = Math.random() * 40;
      points.push(`${x}% ${y}%`);
    }
    points.push("100% 20%", "100% 80%");
    for (let j = segments - 1; j > 0; j--) {
      const x = (j / segments) * 100;
      const y = 60 + Math.random() * 40;
      points.push(`${x}% ${y}%`);
    }
    points.push("0% 80%");
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
            "#ff00ff",
            "#00ffff",
            "#00ff00",
            "#ff0000",
            "#FF959E",
            "#FFFF00",
            "#9D00FF",
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
                clipPath: generateSharpPath(),
                background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
                boxShadow: `0 0 15px ${color1}, 0 0 5px white`,
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
