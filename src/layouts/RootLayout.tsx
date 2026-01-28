import { type ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchOverlay from "#components/effects/GlitchOverlay";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [distortionKey, setDistortionKey] = useState(0);

  useEffect(() => {
    // Glitch timer
    const distortionInterval = setInterval(() => {
      setDistortionKey((prev) => prev + 1);
    }, 3500);

    return () => {
      clearInterval(distortionInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-black">
      {/* Visual Effects Layer */}
      <GlitchOverlay manualTrigger={distortionKey} zIndex={5} />

      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/main-menu/bg.png')" }}
        animate={
          distortionKey > 0
            ? {
                x: [0, -6, 6, 0],
                filter: [
                  "brightness(100%)",
                  "brightness(150%) saturate(150%)",
                  "brightness(100%)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.15 }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
         {children}
      </div>
    </div>
  );
}
