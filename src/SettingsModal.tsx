import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [displayMode, setDisplayMode] = useState("Windowed");
  const [voiceLang, setVoiceLang] = useState("Japanese");
  const [textLang, setTextLang] = useState("English");
  
  // Animation Sequence
  const [stage, setStage] = useState<"init" | "header" | "wiping" | "show">("init");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("header"), 500);
    const t2 = setTimeout(() => setStage("wiping"), 1200);
    const t3 = setTimeout(() => setStage("show"), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Slider Row
  const SliderRow = ({ label, showMute = false }: { label: string; showMute?: boolean }) => {
    const [value, setValue] = useState(75);

    return (
      <div className="flex justify-between mb-3 p-1 ">
        <span className="text-white text-3xl font-bold w-56 text-right mr-20">{label}</span>
        <div className="flex-1 flex items-center pr-25">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-9 bg-gray-600 rounded-lg appearance-none cursor-pointer setting-slider"
            style={{
                background: `linear-gradient(to right, white ${value}%, #9ca3af ${value}%)`
            }}
          />
        </div>
        <div className="w-24 flex justify-end items-center">
        {showMute && (
        <button className="text-white text-3xl font-bold text-right hover:text-[#FF959E] transition-colors pr-15">
            Mute
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
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
  }) => (
    <div className="flex items-center justify-between mb-3 p-1 transition-colors">
      <span className="text-white text-3xl w-56 font-bold text-right mr-20">{label}</span>
      <div className="flex-1 flex gap-8 text-white text-3xl font-bold">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
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
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <style>{`

        .setting-slider::-moz-range-thumb {
            width: 14px;
            height: 36px;
            background: black;
            border: 2px solid #979797;
            border-radius: 4px;
            transition: border-color 0.2s;
        }
        .setting-slider:hover::-moz-range-thumb {
            border-color: #e5e7eb;
        }
      `}</style>

      <div className="relative w-full h-full max-w-[90%] border-none py-10 px-16 overflow-hidden flex flex-col z-10">
         
         {/* Black Cover */}
         <AnimatePresence>
            {stage !== "show" && (
                <motion.div 
                    className="absolute inset-0 bg-black z-50 flex flex-col"
                    initial={{ opacity: 1 }}
                    exit={{ y: "100%", transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                </motion.div>
            )}
         </AnimatePresence>

         {/* Red Wipe */}
         <AnimatePresence>
            {stage === "wiping" && (
                <motion.div
                    className="absolute left-0 right-0 h-screen bg-[#DB404A] z-40"
                    style={{ top: "150px" }}
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            )}
         </AnimatePresence>


        {/* Header */}
        <motion.div 
            className="flex items-end justify-center border-b-4 border-white pb-6 mb-4 relative z-60"
            initial={{ opacity: 0, y: -20 }}
            animate={stage !== "init" ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
          <h2 className="text-6xl font-bold text-white tracking-wider flex items-baseline gap-6">
            <span className="text-[#DB404A] relative inline-block px-2 text-7xl">
                <span className="absolute -left-9 top-1 text-[#DB404A] text-5xl">「</span>
                YOUR
                <span className="absolute -right-10 bottom-1 text-[#DB404A] text-5xl">」</span>
            </span>
            <span>Settings</span>
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 bottom-6 text-3xl font-bold text-white hover:text-[#FF959E] transition-colors"
          >
            Return
          </button>
        </motion.div>

        {/* Subtitle */}
        <motion.div 
            className="text-lg italic text-white bold text-center mb-5 relative z-10"
            initial={{ opacity: 0 }}
            animate={stage === "show" ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
        >
            Let's Customize Our World!?
        </motion.div>

        {/* Content */}
        <div className="relative z-10 px-4 flex flex-col justify-start pb-5">
          <SelectorRow
            label="Display Mode"
            options={["Windowed", "Fullscreen", "Borderless"]}
            selected={displayMode}
            onSelect={setDisplayMode}
          />

          <SliderRow label="Text Speed" />
          <SliderRow label="BGM Volume" showMute />
          <SliderRow label="SFX Volume" showMute />
          <SliderRow label="Voice Volume" showMute />

          <SelectorRow
            label="Voice Language"
            options={["Chinese", "Japanese"]}
            selected={voiceLang}
            onSelect={setVoiceLang}
          />

          <SelectorRow
            label="Language"
            options={["简体中文", "繁體中文", "English", "日本語"]}
            selected={textLang}
            onSelect={setTextLang}
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
