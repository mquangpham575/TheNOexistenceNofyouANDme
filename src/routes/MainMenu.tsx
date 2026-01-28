import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MenuButton from "#components/main-menu/MenuButton";
import SplashScreen from "#components/main-menu/SplashScreen";
import SettingsModal from "#components/settings/SettingsModal";
import TransitionCurtain from "#components/effects/TransitionCurtain";
import { useSettings } from "#context/SettingsContext";
import { useFullscreen } from "#hooks/useFullscreen";
import { useAudio } from "#hooks/useAudio";
import { type MenuItem } from "#types/settings";

export default function MainMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { bgmVolume } = useSettings();
  
  // Audio Hook handles BGM
  useAudio(bgmVolume, "/audio/menu_bgm.mp3", true);

  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // --- State: Transitions & UI ---
  const [curtainMode, setCurtainMode] = useState<"hidden" | "covering" | "exiting">("hidden");
  const [pendingAction, setPendingAction] = useState<"openSettings" | "closeSettings" | null>(null);

  const handleSettingsOpen = () => {
    setPendingAction("openSettings");
    setCurtainMode("covering");
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleCurtainCovered = () => {
    // Settings modal logic
    if (pendingAction === "openSettings") {
      setTimeout(() => {
        setShowSettings(true);
        setCurtainMode("hidden"); 
        setPendingAction(null);
      }, 500);
      return;
    }

    // Simulation load
    setTimeout(() => {
      setCurtainMode("exiting");
      setPendingAction(null);
    }, 400); 
  };

  const handleCurtainComplete = () => {
    setCurtainMode("hidden");
  };

  const menuItems: MenuItem[] = [
    { label: "Continue", action: () => console.log("Continue") },
    { label: "Settings", action: handleSettingsOpen },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "Backers", action: () => console.log("Backers") },
    { 
      label: "Exit", 
      action: () => {
        window.close();
        // Fallback for browsers that block window.close()
        if (!window.closed) {
          alert("Please close this tab to exit.");
        }
      } 
    },
  ];

  const { isFullscreen } = useFullscreen();

  // UI Layer
  const menuContainerStyle = isFullscreen 
    ? "absolute top-10 left-20 z-20 flex flex-col items-center" 
    : "absolute top-10 left-20 z-20 flex flex-col items-center origin-top-left scale-90";

  return (
    <>
      {/* Transition Curtain */}
      <TransitionCurtain 
        mode={curtainMode} 
        onCovered={handleCurtainCovered} 
        onComplete={handleCurtainComplete} 
      />

      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
        {showSettings && (
            <SettingsModal 
              onClose={handleSettingsClose} 
            />
        )}
      </AnimatePresence>
      
      {/* Main Menu UI */}
      <div className={menuContainerStyle}>
        <header className="mb-6">
          <img
            src="/main-menu/logo.png"
            alt="Logo"
            className="w-75 md:w-125 object-contain select-none"
            draggable={false}
          />
        </header>

        <nav
          className="flex flex-col items-center gap-4 select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {menuItems.map((item, index) => (
            <MenuButton
              key={item.label}
              label={item.label}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => setHoveredIndex(index)}
              onAction={item.action}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
