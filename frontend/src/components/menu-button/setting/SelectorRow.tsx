import { useState } from "react";

interface SelectorRowProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  subtitle: string;
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders a row of mutually exclusive options
export function SelectorRow({
  label,
  options,
  selected,
  onSelect,
  subtitle,
  onMouseEnter,
  onMouseLeave,
}: SelectorRowProps) {
  return (
    <div className="flex items-center justify-between mb-3 p-1 transition-colors">
      <span className="text-white text-3xl w-56 font-bold text-right mr-20">
        {label}
      </span>
      <div className="flex-1 flex gap-8 text-white text-3xl font-bold">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)} // Adjustment: triggers selection callback
            onMouseEnter={() => onMouseEnter(subtitle)}
            onMouseLeave={onMouseLeave}
            className={`transition-colors flex items-center ${
              selected === opt
                ? "text-white hover:text-[#FF959E]"
                : "text-white hover:text-[#FF959E]"
            }`}
          >
            {/* Visual indicator for selected option */}
            {selected === opt && (
              <span className="w-3.5 h-8 bg-white rounded-sm mr-2 inline-block"></span>
            )}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

interface GeneralSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders language and localization options
export function GeneralSetting({
  onMouseEnter,
  onMouseLeave,
}: GeneralSettingsProps) {
  const [voiceLang, setVoiceLang] = useState("Japanese");
  const [textLang, setTextLang] = useState("English");

  return (
    <>
      <SelectorRow
        label="Voice Language"
        options={["Chinese", "Japanese"]}
        selected={voiceLang}
        onSelect={setVoiceLang}
        subtitle="Magical Girl Lilth can do anything!"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <SelectorRow
        label="Language"
        options={["简体中文", "繁體中文", "English", "日本語"]}
        selected={textLang}
        onSelect={setTextLang}
        subtitle="How would you like the world's symbols to appear?"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
}

interface GraphicSettingsProps {
  displayMode: string;
  onDisplayModeChange: (mode: string) => void;
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders display mode configuration options
export function GraphicSetting({
  displayMode,
  onDisplayModeChange,
  onMouseEnter,
  onMouseLeave,
}: GraphicSettingsProps) {
  return (
    <SelectorRow
      label="Display Mode"
      options={["Windowed", "Fullscreen", "Borderless"]}
      selected={displayMode}
      onSelect={onDisplayModeChange}
      subtitle="How would you like your world to unfold before you?"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
