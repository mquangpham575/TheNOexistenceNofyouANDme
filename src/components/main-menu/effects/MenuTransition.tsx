import { motion } from "framer-motion";

interface MenuTransitionProps {
  mode: "hidden" | "covering" | "exiting";
  onCovered?: () => void;
  onComplete?: () => void;
  duration?: number;
}

// Renders a full-screen transition curtain animation
export default function MenuTransition({
  mode,
  onCovered,
  onComplete,
  duration = 0.4,
}: MenuTransitionProps) {
  // Animation states: hidden (above), covering (center), exiting (below)
  const variants = {
    hidden: { y: "-100%" },
    covering: { y: "0%" },
    exiting: { y: "100%" },
  };

  return (
    <motion.div
      className="fixed inset-0 z-99999 bg-black"
      initial="hidden"
      animate={mode}
      variants={variants}
      transition={{ duration: duration, ease: "easeInOut" }}
      onAnimationComplete={(definition) => {
        // Trigger callbacks at specific animation stages
        if (definition === "covering" && onCovered) onCovered();
        if (definition === "exiting" && onComplete) onComplete();
      }}
    />
  );
}
