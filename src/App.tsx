import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuButton from "./components/menu/MenuButton";
import SplashScreen from "./components/effects/SplashScreen";
import SettingsModal from "./components/menu/SettingsModal";
import TransitionCurtain from "./components/effects/TransitionCurtain";
import GlitchOverlay from "./components/effects/GlitchOverlay";

interface MenuItem {
  label: string;
  action: () => void;
}


export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bgmVolume, setBgmVolume] = useState(40);
  const prevVolumeRef = useRef(40);
  
  const [sfxVolume, setSfxVolume] = useState(60);
  const prevSfxVolumeRef = useRef(60);
  
  const [voiceVolume, setVoiceVolume] = useState(80);
  const prevVoiceVolumeRef = useRef(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSfxRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceRef = useRef<HTMLAudioElement | null>(null);
  const [distortionKey, setDistortionKey] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Transition
  const [curtainMode, setCurtainMode] = useState<"hidden" | "covering" | "exiting">("hidden");
  const [pendingAction, setPendingAction] = useState<"openSettings" | "closeSettings" | null>(null);


  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume / 100;
    }
  }, [bgmVolume]);

  // Setup music & glitch
  useEffect(() => {
    const audio = new Audio("/audio/menu_bgm.mp3");
    audio.loop = true;
    audio.volume = bgmVolume / 100;
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
    if (bgmVolume > 0) {
      prevVolumeRef.current = bgmVolume;
      setBgmVolume(0);
    } else {
      setBgmVolume(prevVolumeRef.current > 0 ? prevVolumeRef.current : 40);
    }
  };

  // SFX Logic
  const playSfxPreview = (vol: number) => {
    if (currentSfxRef.current) {
        currentSfxRef.current.pause();
        currentSfxRef.current.currentTime = 0;
    }
    const sfx = new Audio("/audio/setting_sfx.MP3");
    sfx.volume = vol / 100;
    sfx.play().catch(() => {});
    currentSfxRef.current = sfx;
  };

  const handleSfxChange = (vol: number) => {
    setSfxVolume(vol);
    playSfxPreview(vol);
  };

  const toggleSfxMute = () => {
    if (sfxVolume > 0) {
        prevSfxVolumeRef.current = sfxVolume;
        setSfxVolume(0);
    } else {
        const restore = prevSfxVolumeRef.current > 0 ? prevSfxVolumeRef.current : 60;
        setSfxVolume(restore);
        playSfxPreview(restore);
    }
  };

  // Voice Logic
  const playVoicePreview = (vol: number) => {
    if (currentVoiceRef.current) {
        currentVoiceRef.current.pause();
        currentVoiceRef.current.currentTime = 0;
    }
    const voice = new Audio("/audio/setting_voice.MP3");
    voice.volume = vol / 100;
    voice.play().catch(() => {});
    currentVoiceRef.current = voice;
  };

  const handleVoiceChange = (vol: number) => {
    setVoiceVolume(vol);
    playVoicePreview(vol);
  };

  const toggleVoiceMute = () => {
    if (voiceVolume > 0) {
        prevVoiceVolumeRef.current = voiceVolume;
        setVoiceVolume(0);
    } else {
        const restore = prevVoiceVolumeRef.current > 0 ? prevVoiceVolumeRef.current : 80;
        setVoiceVolume(restore);
        playVoicePreview(restore);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Continue", action: () => console.log("Continue") },
    { label: "Settings", action: handleSettingsOpen },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "Backers", action: () => console.log("Backers") },
    { label: "Exit", action: () => console.log("Exit") },
  ];

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange(); // Init
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // UI Layer
  const menuContainerStyle = isFullscreen 
    ? "absolute top-10 left-20 z-20 flex flex-col items-center" 
    : "absolute top-10 left-20 z-20 flex flex-col items-center origin-top-left scale-90";

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
            <SettingsModal 
              onClose={handleSettingsClose} 
              bgmVolume={bgmVolume}
              onBgmVolumeChange={setBgmVolume}
              isBgmMuted={bgmVolume === 0}
              onBgmMuteToggle={toggleMute}
              
              sfxVolume={sfxVolume}
              onSfxVolumeChange={handleSfxChange}
              isSfxMuted={sfxVolume === 0}
              onSfxMuteToggle={toggleSfxMute}

              voiceVolume={voiceVolume}
              onVoiceVolumeChange={handleVoiceChange}
              isVoiceMuted={voiceVolume === 0}
              onVoiceMuteToggle={toggleVoiceMute}
            />
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
      <div className={menuContainerStyle}>
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


    </main>
  );
}
