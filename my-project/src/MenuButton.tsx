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
  const dashLines = useMemo(() => {
    if (!isHovered) return [];
    const count = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: count }).map((_, i) => ({
      id: Math.random(),
      top: 10 + Math.random() * 80,
      width: 40 + Math.random() * 30, // Slightly wider for more presence
      duration: 0.4 + Math.random() * 0.2,
      delay: i * 0.04,
    }));
  }, [isHovered]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onAction}
      // REMOVED cursor-none so your custom cursor is always visible
      className="relative h-16 flex items-center justify-center z-10 min-w-95"
    >
      {/* 1. BORDER BACKGROUND */}
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

      {/* 2. DASH LINES LAYER */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isHovered &&
            dashLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: "120%" }}
                animate={{
                  // x: Starts Right, moves through Center, ends at far Left
                  x: ["120%", "20%", "-120%"],
                  // opacity: Fades in quickly, stays bright while passing left, then out
                  opacity: [0, 1, 1, 0],
                  scaleX: [2, 1, 1, 1.5],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: line.duration,
                  delay: line.delay,
                  // times: Ensures it spends more time in the middle/left area
                  times: [0, 0.1, 0.8, 1],
                  ease: "easeOut",
                }}
                className="absolute bg-black"
                style={{
                  top: `${line.top}%`,
                  width: `${line.width}%`,
                  height: "3px",
                  filter: "blur(0.3px)",
                  clipPath:
                    "polygon(0% 10%, 20% 0%, 50% 30%, 80% 0%, 100% 10%, 100% 90%, 80% 100%, 50% 70%, 20% 100%, 0% 90%)",
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* 3. DECORATIVE SQUARES (With Spin-In) */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute bottom-13 left-13 w-6 h-6 bg-black z-20 border-3 border-white overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 90, 90] }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  times: [0, 0.047, 1],
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-black"
              />
            </motion.div>

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
