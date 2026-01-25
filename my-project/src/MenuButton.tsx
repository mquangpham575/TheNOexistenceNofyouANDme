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
      className="relative cursor-pointer h-[64px] flex items-center z-10 w-full min-w-[450px]"
    >
      {/* Decorative Squares */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ scale: 0, x: -15, rotate: -10 }}
              animate={{ scale: 1, x: 0, rotate: 0 }}
              exit={{ scale: 0, x: -15 }}
              className="absolute top-1 left-4 w-6 h-6 bg-[#d33a4f] border-2 border-white z-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            <motion.div
              initial={{ scale: 0, x: 15, rotate: 10 }}
              animate={{ scale: 1, x: 0, rotate: 0 }}
              exit={{ scale: 0, x: 15 }}
              className="absolute bottom-1 right-12 w-6 h-6 bg-white border-2 border-black z-30"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          x: isHovered ? 60 : 40,
          color: isHovered ? "#000000" : "#ffffff",
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative z-20"
        style={{
          textShadow: isHovered ? "none" : "2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        <span className="text-4xl md:text-5xl uppercase italic font-black tracking-tighter select-none">
          {label}
        </span>
      </motion.div>
    </div>
  );
};

export default MenuButton;
