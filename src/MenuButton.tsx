import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuButtonProps {
  label: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onAction: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  isHovered,
  onMouseEnter,
  onAction,
}) => {
  // Generates random glitch lines when you hover
  const dashLines = useMemo(() => {
    if (!isHovered) return [];
    const count = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: count }).map((_, i) => ({
      id: Math.random(),
      top: 10 + Math.random() * 80,
      width: 40 + Math.random() * 40,
      duration: 0.35 + Math.random() * 0.2,
      delay: i * 0.03,
      glitchColor: ["#ff00ff", "#00ffff", "#00ff00", "#ff0000"][
        Math.floor(Math.random() * 4)
      ],
    }));
  }, [isHovered]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onAction}
      className="relative h-16 flex items-center justify-center z-10 min-w-95"
    >
      {/* Main top and bottom borders */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          borderTop: "3px solid #000000",
          borderBottom: "3px solid #000000",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />

      {/* The colorful lines that fly across the button */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isHovered &&
            dashLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: "120%", backgroundColor: "#000000" }}
                animate={{
                  x: ["120%", "20%", "-120%"],
                  opacity: [0, 1, 1, 0],
                  backgroundColor: [
                    "#000000",
                    line.glitchColor,
                    "#ffffff",
                    line.glitchColor,
                    "#000000",
                  ],
                  y: [0, -2, 2, -1, 0],
                  scaleY: [1, 2, 0.5, 1.5, 1],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: line.duration,
                  delay: line.delay,
                  times: [0, 0.1, 0.8, 1],
                  ease: "easeOut",
                  backgroundColor: { duration: 0.1, repeat: Infinity },
                  y: { duration: 0.1, repeat: Infinity },
                }}
                className="absolute"
                style={{
                  top: `${line.top}%`,
                  width: `${line.width}%`,
                  height: "3px",
                  filter: "blur(0.3px)",
                  boxShadow: `0 0 8px ${line.glitchColor}66`,
                  clipPath:
                    "polygon(0% 10%, 20% 0%, 50% 30%, 80% 0%, 100% 10%, 100% 90%, 80% 100%, 50% 70%, 20% 100%, 0% 90%)",
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Background shapes that appear on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Black square that swings left and right */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{
                scale: 1,
                rotate: [-90, 90, 90, -90, -90],
              }}
              exit={{ scale: 0 }}
              transition={{
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.025, 0.5, 0.525, 1],
                },
                scale: { duration: 0.1 },
              }}
              className="absolute bottom-13 left-13 w-6 h-6 bg-black z-20 border-3 border-white"
            />

            {/* Red square moving in a small box pattern */}
            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1,
                x: [0, 5, 5, 0, 0],
                y: [0, 0, 5, 5, 0],
              }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{
                x: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "linear" },
                default: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="absolute top-0 left-5 w-9 h-9 bg-[#d33a4f] border-3 border-white z-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />

            {/* White square moving in a small box pattern */}
            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1,
                x: [0, -5, -5, 0, 0],
                y: [0, 0, -5, -5, 0],
              }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{
                x: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "linear" },
                default: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="absolute top-13 right-15 w-6 h-6 bg-white border-3 border-black z-30"
            />
          </>
        )}
      </AnimatePresence>

      {/* The text inside the button */}
      <motion.div
        animate={{
          color: isHovered ? "#FF959E" : "#000000",
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative z-20"
      >
        <span className="font-title text-3xl font-black">{label}</span>
      </motion.div>
    </div>
  );
};

export default MenuButton;
