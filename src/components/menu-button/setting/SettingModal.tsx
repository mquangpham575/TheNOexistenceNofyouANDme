import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlitchOverlay from "#components/effects/GlitchOverlay";
import { SettingHeader } from "./SettingHeader";
import { AudioSetting, TextSetting } from "./SliderRow";
import { GraphicSetting, GeneralSetting } from "./SelectorRow";
import { SettingFooter } from "./SettingFooter";

interface SettingsModalProps {
  onClose: () => void;
}

// Renders the settings modal with various configuration sections
export default function SettingModal({ onClose }: SettingsModalProps) {
  // State and logic for handling display modes (Windowed, Fullscreen, Borderless)
  const [displayMode, setDisplayMode] = useState("Windowed");
  const intendedModeRef = useRef("Windowed");

  // Syncs internal state with actual document fullscreen changes
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

  // Requests fullscreen or windowed mode based on user selection
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

  // Manages the bottom curtain reveal animation
  const [showBottomCurtains, setShowBottomCurtains] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000)); // Adjustment: delay before showing curtains
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

  // State for dynamic subtitle text on hover
  const defaultSubtitle = "Let's Customize Our World!?";
  const [activeSubtitle, setActiveSubtitle] = useState(defaultSubtitle);

  // Updates subtitle when hovering over settings
  const handleMouseEnter = (subtitle: string) => {
    setActiveSubtitle(subtitle);
  };

  // Resets subtitle when mouse leaves
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
            -webkit-appearance: none; // Adjustment: removes default slider appearance
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

      {/* Main Container */}
      <div
        className={`relative w-full h-full max-w-[90%] border-none py-10 px-16 flex flex-col z-10 transition-transform duration-500 ${displayMode === "Fullscreen" || displayMode === "Borderless" ? "scale-110 origin-center" : ""}`}
      >
        <SettingHeader
          onClose={onClose}
          showBottomCurtains={showBottomCurtains}
        />

        {/* Dynamic Subtitle Display */}
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

        {/* Settings Sections */}
        <div className="relative z-105 px-4 flex flex-col justify-start pb-5">
          <GraphicSetting
            displayMode={displayMode}
            onDisplayModeChange={handleDisplayModeSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <TextSetting
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <AudioSetting
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <GeneralSetting
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>

        {/* Reset Button */}
        {/* Setting Footer */}
        <SettingFooter />
      </div>
    </motion.div>
  );
}
