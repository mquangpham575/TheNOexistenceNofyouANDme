import { useRef } from "react";
import { useSettings } from "#context/SettingsContext";
import { SliderRow } from "#components/settings/components/SliderRow";

interface AudioSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

export function AudioSettings({ onMouseEnter, onMouseLeave }: AudioSettingsProps) {
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
