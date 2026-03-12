import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MenuButton from "#components/MenuButton";
import LoadingScreen from "#components/LoadingScreen";
import SettingModal from "#components/menu-button/setting/SettingModal";
import MenuTransition from "#components/effects/MenuTransition";
import { useSettings } from "#context/SettingsContext";
import { useFullscreen } from "#hooks/useFullscreen";
import { useAudio } from "#hooks/useAudio";
import { type MenuItem } from "#types/settings";
import { useAuth } from "#context/AuthContext";

// Renders the main menu with navigation, settings, and audio integration
export default function MainMenu() {
  const navigate = useNavigate();
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
    { label: "Continue", action: () => navigate("/book-note") },
    { label: "Settings", action: handleSettingsOpen },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "Backers", action: () => console.log("Backers") },
    {
      label: "Exit",
      action: () => {
        // Play exit audio
        const audio = new Audio("/audio/bye.MP3");
        audio.volume = 1; // Adjustment: Exit audio volume
        audio.play().catch((e) => console.error("Exit audio failed:", e));

        // Start transition
        setTimeout(() => {
          window.close();
          // Fallback for browsers that block window.close()
          if (!window.closed) {
            alert("Please close this tab to exit.");
          }
        }, 3000);
      },
    },
  ];

  const { isFullscreen } = useFullscreen();
  const { user, logout } = useAuth();

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

      {/* Top-right auth buttons */}
      <div className="absolute top-4 right-6 z-30 flex items-center gap-3 select-none">
        {user ? (
          <>
            <Link
              to="/profile"
              className="font-title text-lg tracking-widest text-white hover:text-[#FF959E] transition-colors"
            >
              {user.profile?.displayName ?? user.email}
            </Link>
            <button
              onClick={logout}
              className="border border-[#DB404A]/70 text-[#DB404A]/80 text-sm px-3 py-1 hover:text-[#DB404A] hover:border-[#DB404A] transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-white text-white font-title text-lg tracking-widest px-4 py-1 hover:text-[#FF959E] hover:border-[#FF959E] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white text-white font-title text-lg tracking-widest px-4 py-1 hover:text-[#FF959E] hover:border-[#FF959E] transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>

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
