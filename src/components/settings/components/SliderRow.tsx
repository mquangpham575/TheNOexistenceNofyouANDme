import { useState, useEffect } from "react";

interface SliderRowProps {
  label: string;
  showMute?: boolean;
  value?: number;
  onChange?: (val: number) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  subtitle: string;
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

export function SliderRow({ 
  label, 
  showMute = false,
  value,
  onChange,
  isMuted,
  onToggleMute,
  subtitle,
  onMouseEnter,
  onMouseLeave
}: SliderRowProps) {
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
          onMouseEnter={() => onMouseEnter(subtitle)} 
          onMouseLeave={onMouseLeave}
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
          onMouseEnter={() => onMouseEnter(subtitle)}
          onMouseLeave={onMouseLeave}
          className={`text-3xl font-bold text-right transition-colors pr-15 ${isMuted ? "text-[#FF959E]" : "text-white hover:text-[#FF959E]"}`}
      >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}
      </div>
    </div>
  );
};
