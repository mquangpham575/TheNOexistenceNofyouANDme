import { useState, useRef } from "react";
import { useSettings } from "#context/SettingsContext";

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

// Renders a range slider with optional mute toggle
export function SliderRow({
  label,
  showMute = false,
  value,
  onChange,
  isMuted,
  onToggleMute,
  subtitle,
  onMouseEnter,
  onMouseLeave,
}: SliderRowProps) {
  const [localValue, setLocalValue] = useState(value ?? 75); // Adjustment: Default slider value if undefined
  const [prevPropsValue, setPrevPropsValue] = useState(value);

  // Sync internal state with prop value changes during render
  if (value !== prevPropsValue) {
    setPrevPropsValue(value);
    setLocalValue(value ?? 75); // Adjustment: Default slider value if undefined
  }

  // Updates local state while dragging
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setLocalValue(newVal);
  };

  // Commits value on release
  const handleCommit = () => {
    if (onChange) {
      onChange(localValue);
    }
  };

  return (
    <div className="flex justify-between mb-3 p-1 ">
      <span className="text-white text-3xl font-bold w-56 text-right mr-20">
        {label}
      </span>
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
            background: `linear-gradient(to right, white ${localValue}%, #979797 ${localValue}%)`,
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
}

interface AudioSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders audio configuration controls for BGM, SFX, and Voice
export function AudioSetting({
  onMouseEnter,
  onMouseLeave,
}: AudioSettingsProps) {
  const {
    bgmVolume,
    setBgmVolume,
    sfxVolume,
    setSfxVolume,
    voiceVolume,
    setVoiceVolume,
  } = useSettings();

  const prevVolumeRef = useRef(bgmVolume);
  const prevSfxVolumeRef = useRef(sfxVolume);
  const prevVoiceVolumeRef = useRef(voiceVolume);
  const currentSfxRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceRef = useRef<HTMLAudioElement | null>(null);

  // Toggles BGM mute state, restoring previous volume if unmuted
  const toggleMute = () => {
    if (bgmVolume > 0) {
      prevVolumeRef.current = bgmVolume;
      setBgmVolume(0);
    } else {
      setBgmVolume(prevVolumeRef.current > 0 ? prevVolumeRef.current : 40);
    }
  };

  // Plays a preview sound when SFX volume changes
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

  // Updates SFX volume and plays preview
  const handleSfxChange = (vol: number) => {
    setSfxVolume(vol);
    playSfxPreview(vol);
  };

  // Toggles SFX mute and restores previous volume
  const toggleSfxMute = () => {
    if (sfxVolume > 0) {
      prevSfxVolumeRef.current = sfxVolume;
      setSfxVolume(0);
    } else {
      const restore =
        prevSfxVolumeRef.current > 0 ? prevSfxVolumeRef.current : 60;
      setSfxVolume(restore);
      playSfxPreview(restore);
    }
  };

  // Plays a preview voice line when Voice volume changes
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

  // Updates Voice volume and plays preview
  const handleVoiceChange = (vol: number) => {
    setVoiceVolume(vol);
    playVoicePreview(vol);
  };

  // Toggles Voice mute and restores previous volume
  const toggleVoiceMute = () => {
    if (voiceVolume > 0) {
      prevVoiceVolumeRef.current = voiceVolume;
      setVoiceVolume(0);
    } else {
      const restore =
        prevVoiceVolumeRef.current > 0 ? prevVoiceVolumeRef.current : 80;
      setVoiceVolume(restore);
      playVoicePreview(restore);
    }
  };

  return (
    <>
      <SliderRow
        label="BGM Volume"
        showMute
        value={bgmVolume}
        onChange={setBgmVolume}
        isMuted={bgmVolume === 0}
        onToggleMute={toggleMute}
        subtitle="Hope it won't effect my voice~"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <SliderRow
        label="SFX Volume"
        showMute
        value={sfxVolume}
        onChange={handleSfxChange}
        isMuted={sfxVolume === 0}
        onToggleMute={toggleSfxMute}
        subtitle="You can adjust the game sound effects here."
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <SliderRow
        label="Voice Volume"
        showMute
        value={voiceVolume}
        onChange={handleVoiceChange}
        isMuted={voiceVolume === 0}
        onToggleMute={toggleVoiceMute}
        subtitle="How's this sound~?"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
}

interface TextSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders text playback speed controls
export function TextSetting({ onMouseEnter, onMouseLeave }: TextSettingsProps) {
  return (
    <SliderRow
      label="Text Speed"
      subtitle="Want me to speak faster or slower ? No problem at all!"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
