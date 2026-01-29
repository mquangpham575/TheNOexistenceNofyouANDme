import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlitchOverlay from "#components/effects/GlitchOverlay";
import { SettingsHeader } from "#components/settings/sections/SettingsHeader";
import { AudioSettings } from "#components/settings/sections/AudioSettings";
import { GraphicSettings } from "#components/settings/sections/GraphicSettings";
import { TextSettings } from "#components/settings/sections/TextSettings";
import { GeneralSettings } from "#components/settings/sections/GeneralSettings";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  // --- Display Mode Logic ---
  const [displayMode, setDisplayMode] = useState("Windowed");
  const intendedModeRef = useRef("Windowed");

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      if (isFs) {
        if (intendedModeRef.current === "Borderless") {
          setDisplayMode("Borderless");
        } else {
          setDisplayMode("Fullscreen");
        }
      } else {
        setDisplayMode("Windowed");
        intendedModeRef.current = "Windowed";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleDisplayModeSelect = (mode: string) => {
    intendedModeRef.current = mode;
    setDisplayMode(mode);
    if (mode === "Fullscreen" || mode === "Borderless") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
      }
    }
  };

  // --- Curtain Animation Constants ---
  const [showBottomCurtains, setShowBottomCurtains] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    const imgLoad = new Promise((resolve) => {
      const img = new Image();
      img.src = "/main-menu/bg.png";
      if (img.complete) resolve(null);
      else img.onload = () => resolve(null);
    });

    Promise.all([minDelay, imgLoad]).then(() => {
      setShowBottomCurtains(true);
    });
  }, []);

  // --- Subtitle State ---
  const defaultSubtitle = "Let's Customize Our World!?";
  const [activeSubtitle, setActiveSubtitle] = useState(defaultSubtitle);

  const handleMouseEnter = (subtitle: string) => {
    setActiveSubtitle(subtitle);
  };

  const handleMouseLeave = () => {
    setActiveSubtitle(defaultSubtitle);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center select-none"
      style={{ backgroundImage: "url('/main-menu/bg.png')" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <GlitchOverlay zIndex={5} />
      <style>{`
        .setting-slider::-moz-range-thumb {
            width: 16px;
            height: 38px;
            background: black;
            border: 3px solid #A9A9A9;
            border-radius: 5px;
            transition: border-color 0.2s;
        }
        .setting-slider:hover::-moz-range-thumb {
            border-color: #DDDDDD;
        }
      `}</style>
      <style>{`
        /* WebKit/Blink (Chrome, Edge, Safari) */
        .setting-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 38px;
            background: black;
            border: 3px solid #A9A9A9;
            border-radius: 5px;
            transition: border-color 0.2s;
            cursor: url("/cursor.png") 0 0, auto;
        }
        .setting-slider:hover::-webkit-slider-thumb {
            border-color: #DDDDDD;
        }
      `}</style>

      {/* Modal Container */}
      <div className={`relative w-full h-full max-w-[90%] border-none py-10 px-16 flex flex-col z-10 transition-transform duration-500 ${(displayMode === "Fullscreen" || displayMode === "Borderless") ? "scale-110 origin-center" : ""}`}>
        
        <SettingsHeader onClose={onClose} showBottomCurtains={showBottomCurtains} />

        {/* Subtitle */}
        <div className="text-lg italic text-white font-bold text-center mb-5 mt-3 relative z-105 h-8 overflow-hidden">
          <motion.span
            key={activeSubtitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block"
          >
            {activeSubtitle}
          </motion.span>
        </div>

        {/* Content */}
        <div className="relative z-105 px-4 flex flex-col justify-start pb-5">
          <GraphicSettings 
            displayMode={displayMode} 
            onDisplayModeChange={handleDisplayModeSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <TextSettings 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          
          <AudioSettings 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          
          <GeneralSettings 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />


        </div>

        {/* Footer */}
        <div className="flex justify-center ">
          <button className="text-4xl font-bold text-white hover:text-[#FF959E] transition-colors tracking-widest">
            Reset
          </button>
        </div>

      </div>
    </motion.div>
  );
}
