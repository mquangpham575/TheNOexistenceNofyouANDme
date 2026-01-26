import { motion } from "framer-motion";

interface TransitionCurtainProps {
  mode: "hidden" | "covering" | "exiting";
  onCovered?: () => void;
  onComplete?: () => void;
}

export default function TransitionCurtain({ mode, onCovered, onComplete }: TransitionCurtainProps) {
  const variants = {
    hidden: { y: "-100%" },
    covering: { y: "0%" },
    exiting: { y: "100%" },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-black"
      initial="hidden"
      animate={mode}
      variants={variants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onAnimationComplete={(definition) => {
        if (definition === "covering" && onCovered) onCovered();
        if (definition === "exiting" && onComplete) onComplete();
      }}
    />
  );
}
