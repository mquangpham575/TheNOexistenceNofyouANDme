import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlitchOverlay from "#components/effects/GlitchOverlay";
import { useSettings } from "#context/SettingsContext";
import { SliderRow } from "#components/settings/components/SliderRow";
import { SelectorRow } from "#components/settings/components/SelectorRow";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { 
    bgmVolume, setBgmVolume,
    sfxVolume, setSfxVolume,
    voiceVolume, setVoiceVolume
  } = useSettings();
  
  const prevVolumeRef = useRef(bgmVolume);
  const prevSfxVolumeRef = useRef(sfxVolume);
  const prevVoiceVolumeRef = useRef(voiceVolume);
  const currentSfxRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceRef = useRef<HTMLAudioElement | null>(null);

  // --- Helpers for Audio ---
  const toggleMute = () => {
      if (bgmVolume > 0) {
        prevVolumeRef.current = bgmVolume;
        setBgmVolume(0);
      } else {
        setBgmVolume(prevVolumeRef.current > 0 ? prevVolumeRef.current : 40);
      }
    };
  
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
  const [voiceLang, setVoiceLang] = useState("Japanese");
  const [textLang, setTextLang] = useState("English");
  
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
         
        {/* Header Section */}
        <div className="relative">
            {/* Top Curtain - Anchored to bottom of header line */}
            <motion.div
                className="absolute left-1/2 bottom-0 w-[150vw] h-[150vh] bg-black pointer-events-none"
                style={{ translateX: "-50%", zIndex: 102 }}
                initial={{ y: "0%" }}
                animate={{ y: "100%", transitionEnd: { opacity: 0 } }}
                exit={{ y: "0%", opacity: 1, zIndex: 102 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            />

            {/* Top White Curtain - Follows the Black curtain */}
            <motion.div
                className="absolute left-1/2 bottom-0 w-[150vw] h-[150vh] bg-white pointer-events-none"
                style={{ translateX: "-50%", zIndex: 101 }}
                initial={{ y: "0%" }}
                animate={{ y: "100%", transitionEnd: { opacity: 0 } }}
                exit={{ y: "0%", opacity: 1, zIndex: 101 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
            />
            
            {/* Bottom Curtain (Black Layer) - Moves to reveal Pink */}
            <motion.div
                className="absolute left-1/2 top-full w-[150vw] h-[150vh] bg-black pointer-events-none"
                style={{ translateX: "-50%", zIndex: 120 }}
                initial={{ y: "0%" }}
                animate={showBottomCurtains ? { y: "100%" } : { y: "0%" }}
                exit={{ y: "0%" }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            />

            {/* Bottom Pink Curtain - Moves to reveal Content */}
            <motion.div
                className="absolute left-1/2 top-full w-[150vw] h-[150vh] bg-[#FF959E] pointer-events-none"
                style={{ translateX: "-50%", zIndex: 115 }}
                initial={{ y: "0%" }}
                animate={showBottomCurtains ? { y: "100%" } : { y: "0%" }}
                exit={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
            />

            {/* Header Content */}
            <motion.div 
                className="flex items-end justify-center border-b-4 border-white pb-6  relative z-60"
                initial={{ opacity: 1 }}
                // No extra animation, static reveal by curtain
            >
            <h2 className="text-6xl font-bold text-white tracking-wider flex items-baseline gap-10">
                <span className="text-[#DB404A] relative inline-block px-2 text-7xl">
                    <span className="absolute -left-9 top-1 text-[#DB404A] text-5xl">「</span>
                    YOUR
                    <span className="absolute -right-10 bottom-1 text-[#DB404A] text-5xl">」</span>
                </span>
                <span className="text-5xl">Settings</span>
            </h2>
            <button
                onClick={onClose}
                className="absolute right-0 bottom-6 text-3xl font-bold text-white hover:text-[#FF959E] transition-colors"
            >
                Return
            </button>
            </motion.div>
        </div>

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
          <SelectorRow
            label="Display Mode"
            options={["Windowed", "Fullscreen", "Borderless"]}
            selected={displayMode}
            onSelect={handleDisplayModeSelect}
            subtitle="How would you like your world to unfold before you?"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <SliderRow 
            label="Text Speed" 
            subtitle="Want me to speak faster or slower ? No problem at all!"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <SliderRow 
            label="BGM Volume" 
            showMute 
            value={bgmVolume}
            onChange={setBgmVolume}
            isMuted={bgmVolume === 0}
            onToggleMute={toggleMute}
            subtitle="Hope it won't effect my voice~"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <SliderRow 
            label="SFX Volume" 
            showMute 
            value={sfxVolume}
            onChange={handleSfxChange}
            isMuted={sfxVolume === 0}
            onToggleMute={toggleSfxMute}
            subtitle="You can adjust the game sound effects here."
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <SliderRow 
            label="Voice Volume" 
            showMute 
            value={voiceVolume}
            onChange={handleVoiceChange}
            isMuted={voiceVolume === 0}
            onToggleMute={toggleVoiceMute}
            subtitle="How's this sound~?"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <SelectorRow
            label="Voice Language"
            options={["Chinese", "Japanese"]}
            selected={voiceLang}
            onSelect={setVoiceLang}
            subtitle="Magical Girl Lilth can do anything!"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          <SelectorRow
            label="Language"
            options={["简体中文", "繁體中文", "English", "日本語"]}
            selected={textLang}
            onSelect={setTextLang}
            subtitle="How would you like the world's symbols to appear?"
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
