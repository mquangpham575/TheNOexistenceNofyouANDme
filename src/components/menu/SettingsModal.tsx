import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchOverlay from "../effects/GlitchOverlay";

interface SettingsModalProps {
  onClose: () => void;
  bgmVolume?: number;
  onBgmVolumeChange?: (vol: number) => void;
  isBgmMuted?: boolean;
  onBgmMuteToggle?: () => void;
  // SFX
  sfxVolume?: number;
  onSfxVolumeChange?: (vol: number) => void;
  isSfxMuted?: boolean;
  onSfxMuteToggle?: () => void;
  // Voice
  voiceVolume?: number;
  onVoiceVolumeChange?: (vol: number) => void;
  isVoiceMuted?: boolean;
  onVoiceMuteToggle?: () => void;
}

export default function SettingsModal({ 
  onClose,
  bgmVolume,
  onBgmVolumeChange,
  isBgmMuted,
  onBgmMuteToggle,
  sfxVolume,
  onSfxVolumeChange,
  isSfxMuted,
  onSfxMuteToggle,
  voiceVolume,
  onVoiceVolumeChange,
  isVoiceMuted,
  onVoiceMuteToggle
}: SettingsModalProps) {
  const [displayMode, setDisplayMode] = useState("Windowed");
  const [voiceLang, setVoiceLang] = useState("Japanese");
  const [textLang, setTextLang] = useState("English");
  
  const [showBottomCurtains, setShowBottomCurtains] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    const imgLoad = new Promise((resolve) => {
      const img = new Image();
      img.src = "/bg.png";
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

  // Slider Row
  const SliderRow = ({ 
    label, 
    showMute = false,
    value,
    onChange,
    isMuted,
    onToggleMute,
    subtitle // Add subtitle prop
  }: { 
    label: string; 
    showMute?: boolean;
    value?: number;
    onChange?: (val: number) => void;
    isMuted?: boolean;
    onToggleMute?: () => void;
    subtitle: string; // Required subtitle
  }) => {
    const [localValue, setLocalValue] = useState(value ?? 75);
    
    useEffect(() => {
        if (value !== undefined) {
             setLocalValue(value);
        }
    }, [value]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        setLocalValue(newVal);
    };

    const handleCommit = () => {
        if (onChange) {
            onChange(localValue);
        }
    };

    return (
      <div className="flex justify-between mb-3 p-1 ">
        <span className="text-white text-3xl font-bold w-56 text-right mr-20">{label}</span>
        <div className="flex-1 flex items-center pr-25">
          <input
            type="range"
            min="0"
            max="100"
            value={localValue}
            onChange={handleSliderChange}
            onMouseUp={handleCommit}
            onTouchEnd={handleCommit}
            onMouseEnter={() => handleMouseEnter(subtitle)}
            onMouseLeave={handleMouseLeave}
            className="w-full h-9 bg-gray-600 rounded-lg appearance-none cursor-pointer setting-slider"
            style={{
                background: `linear-gradient(to right, white ${localValue}%, #979797 ${localValue}%)`
            }}
          />
        </div>
        <div className="w-24 flex justify-end items-center">
        {showMute && (
        <button 
            onClick={onToggleMute}
            onMouseEnter={() => handleMouseEnter(subtitle)}
            onMouseLeave={handleMouseLeave}
            className={`text-3xl font-bold text-right transition-colors pr-15 ${isMuted ? "text-[#FF959E]" : "text-white hover:text-[#FF959E]"}`}
        >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        )}
        </div>
      </div>
    );
  };

  // Selector Row
  const SelectorRow = ({
    label,
    options,
    selected,
    onSelect,
    subtitle // Add subtitle prop
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
    subtitle: string; // Required subtitle
  }) => (
    <div className="flex items-center justify-between mb-3 p-1 transition-colors">
      <span className="text-white text-3xl w-56 font-bold text-right mr-20">{label}</span>
      <div className="flex-1 flex gap-8 text-white text-3xl font-bold">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            onMouseEnter={() => handleMouseEnter(subtitle)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors flex items-center ${
              selected === opt ? "text-white hover:text-[#FF959E]" : "text-white hover:text-[#FF959E]"
            }`}
          >
             {selected === opt && <span className="w-3.5 h-8 bg-white rounded-sm mr-2 inline-block"></span>}
             {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center select-none"
      style={{ backgroundImage: "url('/bg.png')" }}
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
            cursor: pointer;
        }
        .setting-slider:hover::-webkit-slider-thumb {
            border-color: #DDDDDD;
        }
      `}</style>

      {/* Main Container */}
      <div className="relative w-full h-full max-w-[90%] border-none py-10 px-16 flex flex-col z-10">
         
        {/* Header containing the anchor */}
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

            {/* Actual Header Content */}
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
            onSelect={setDisplayMode}
            subtitle="How would you like your world to unfold before you?"
          />

          <SliderRow 
            label="Text Speed" 
            subtitle="Want me to speak faster or slower ? No problem at all!"
          />
          <SliderRow 
            label="BGM Volume" 
            showMute 
            value={bgmVolume}
            onChange={onBgmVolumeChange}
            isMuted={isBgmMuted}
            onToggleMute={onBgmMuteToggle}
            subtitle="Hope it won't effect my voice~"
          />
          <SliderRow 
            label="SFX Volume" 
            showMute 
            value={sfxVolume}
            onChange={onSfxVolumeChange}
            isMuted={isSfxMuted}
            onToggleMute={onSfxMuteToggle}
            subtitle="You can adjust the game sound effects here."
          />
          <SliderRow 
            label="Voice Volume" 
            showMute 
            value={voiceVolume}
            onChange={onVoiceVolumeChange}
            isMuted={isVoiceMuted}
            onToggleMute={onVoiceMuteToggle}
            subtitle="How's this sound~?"
          />

          <SelectorRow
            label="Voice Language"
            options={["Chinese", "Japanese"]}
            selected={voiceLang}
            onSelect={setVoiceLang}
            subtitle="Magical Girl Lilth can do anything!"
          />

          <SelectorRow
            label="Language"
            options={["简体中文", "繁體中文", "English", "日本語"]}
            selected={textLang}
            onSelect={setTextLang}
            subtitle="How would you like the world's symbols to appear?"
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
