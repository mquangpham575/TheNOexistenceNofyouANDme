import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

// Renders initial splash screen with loading and dismissal animation
export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Handles minimum display time and resource loading check
  useEffect(() => {
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1000)); // Adjustment: Minimum splash duration
    const contentLoad = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(true);
      } else {
        window.addEventListener("load", () => resolve(true));
      }
    });

    // Wait for minimum time AND content load
    Promise.all([minLoadTime, contentLoad]).then(() => {
      setIsLoading(false);
    });
  }, []);

  // Completes splash screen sequence on user interaction
  const handleClick = () => {
    if (!isLoading) {
      onComplete();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black cursor-pointer select-none"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
      onClick={handleClick}
    >
      <div className=" text-white font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif] tracking-[2px] uppercase text-6xl animate-pulse">
        {isLoading ? "Loading..." : "Welcome"}
      </div>
    </motion.div>
  );
}
