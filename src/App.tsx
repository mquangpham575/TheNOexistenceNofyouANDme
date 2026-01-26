import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuButton from "./MenuButton";
import SplashScreen from "./SplashScreen";
import SettingsModal from "./SettingsModal";
import TransitionCurtain from "./TransitionCurtain";
import GlitchOverlay from "./GlitchOverlay";

interface MenuItem {
  label: string;
  action: () => void;
}


export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [distortionKey, setDistortionKey] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Transition
  const [curtainMode, setCurtainMode] = useState<"hidden" | "covering" | "exiting">("hidden");
  const [pendingAction, setPendingAction] = useState<"openSettings" | "closeSettings" | null>(null);

  // Setup music & glitch
  useEffect(() => {
    const audio = new Audio("/menu_bgm.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Auto-play workaround
    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    // Glitch trigger
    const distortionInterval = setInterval(() => {
      setDistortionKey((prev) => prev + 1);
    }, 3500);

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
      clearInterval(distortionInterval);
    };
  }, []);

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

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Continue", action: () => console.log("Continue") },
    { label: "Settings", action: handleSettingsOpen },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "Backers", action: () => console.log("Backers") },
    { label: "Exit", action: () => console.log("Exit") },
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden font-sans bg-black">
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
            <SettingsModal onClose={handleSettingsClose} />
        )}
      </AnimatePresence>
      {/* Distortion Layer */}
      {/* Distortion Layer */}
      <GlitchOverlay manualTrigger={distortionKey} zIndex={5} />

      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/bg.png')" }}
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

      {/* UI Layer */}
      <div className="absolute top-10 left-20 z-20 flex flex-col items-center">
        <header className="mb-6">
          <img
            src="/logo.png"
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

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-10 right-10 z-30 px-3 py-1 bg-black/40 border border-white/50 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
      >
        {isMuted ? "Muted" : "Audio On"}
      </button>
    </main>
  );
}
