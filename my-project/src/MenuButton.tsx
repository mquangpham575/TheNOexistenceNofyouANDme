import React from "react";
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
  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onAction}
      className="relative h-[64px] flex items-center justify-center z-10 min-w-[380px]"
    >
      {/* --- PERSISTENT BORDER & HIGHLIGHT LAYER --- */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        initial={false}
        style={{
          borderTop: "3px solid #000000",
          borderBottom: "3px solid #000000",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>{isHovered && <></>}</AnimatePresence>
      </motion.div>

      {/* Decorative Squares */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* 1. Static/Spinning Black Square behind the Red one */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: 1,
                // We animate from 0 to 90, then hold at 90
                rotate: [0, 90, 90],
              }}
              exit={{ scale: 0 }}
              transition={{
                rotate: {
                  duration: 2.1, // Total time for one "step" (0.1s move + 2s wait)
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.047, 1],
                },
                scale: { duration: 0.1 },
              }}
              className="absolute bottom-13 left-13 w-6 h-6 bg-black z-20 border-3 border-white"
            />

            {/* 2. Red Square with Square Route Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                // Moving in a square route: Right -> Down -> Left -> Up
                x: [0, 5, 5, 0, 0],
                y: [0, 0, 5, 5, 0],
              }}
              exit={{ scale: 0 }}
              transition={{
                x: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.2 },
              }}
              className="absolute top-0 left-5 w-9 h-9 bg-[#d33a4f] border-3 border-white z-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />

            {/* 3. White Square with Square Route Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                // Moving in a square route: Left -> Up -> Right -> Down
                x: [0, -5, -5, 0, 0],
                y: [0, 0, -5, -5, 0],
              }}
              exit={{ scale: 0 }}
              transition={{
                x: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.2 },
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
        style={{
          textShadow: isHovered ? "none" : "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <span className="text-3xl font-black">{label}</span>
      </motion.div>
    </div>
  );
};

export default MenuButton;
