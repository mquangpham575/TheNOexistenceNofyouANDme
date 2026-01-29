import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MenuButton from "#components/main-menu/MenuButton";
import LoadingScreen from "#components/main-menu/LoadingScreen";
import SettingModal from "#components/main-menu/menu-button/setting/SettingModal";
import MenuTransition from "#components/main-menu/effects/MenuTransition";
import { useSettings } from "#context/SettingsContext";
import { useFullscreen } from "#hooks/useFullscreen";
import { useAudio } from "#hooks/useAudio";
import { type MenuItem } from "#types/settings";

// Renders the main menu with navigation, settings, and audio integration
export default function MainMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { bgmVolume } = useSettings();

  // Plays background music with volume control
  useAudio(bgmVolume, "/audio/menu_bgm.mp3", true);

  // Modal visibility states
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // UI and transition state
  const [curtainMode, setCurtainMode] = useState<
    "hidden" | "covering" | "exiting"
  >("hidden");
  const [pendingAction, setPendingAction] = useState<
    "openSettings" | "closeSettings" | null
  >(null);

  // Initiates transition to settings modal
  const handleSettingsOpen = () => {
    setPendingAction("openSettings");
    setCurtainMode("covering");
  };

  // closes settings modal
  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  // Executes navigation actions when view is fully obscured
  const handleCurtainCovered = () => {
    // Open settings modal logic
    if (pendingAction === "openSettings") {
      setTimeout(() => {
        setShowSettings(true);
        setCurtainMode("hidden");
        setPendingAction(null);
      }, 500);
      return;
    }

    // Default simulation load logic
    setTimeout(() => {
      setCurtainMode("exiting");
      setPendingAction(null);
    }, 400);
  };

  // Resets curtain state after animation ends
  const handleCurtainComplete = () => {
    setCurtainMode("hidden");
  };

  // definitions for menu buttons and their handlers
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
      },
    },
  ];

  const { isFullscreen } = useFullscreen();

  // Dynamic style based on fullscreen state
  const menuContainerStyle = isFullscreen
    ? "absolute top-10 left-20 z-20 flex flex-col items-center"
    : "absolute top-10 left-20 z-20 flex flex-col items-center origin-top-left scale-90";

  return (
    <>
      {/* Transition Curtain for scene changes */}
      <MenuTransition
        mode={curtainMode}
        onCovered={handleCurtainCovered}
        onComplete={handleCurtainComplete}
      />

      {/* Modals: Splash Screen and Settings */}
      <AnimatePresence>
        {showSplash && (
          <LoadingScreen onComplete={() => setShowSplash(false)} />
        )}
        {showSettings && <SettingModal onClose={handleSettingsClose} />}
      </AnimatePresence>

      {/* Main Menu UI: Logo and Navigation Buttons */}
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
