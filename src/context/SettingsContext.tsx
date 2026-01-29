import { createContext, useContext, useState, type ReactNode } from "react";

interface SettingsContextType {
  bgmVolume: number;
  setBgmVolume: (vol: number) => void;
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;
  voiceVolume: number;
  setVoiceVolume: (vol: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [bgmVolume, setBgmVolume] = useState(65);
  const [sfxVolume, setSfxVolume] = useState(65);
  const [voiceVolume, setVoiceVolume] = useState(80);

  return (
    <SettingsContext.Provider value={{
      bgmVolume, setBgmVolume,
      sfxVolume, setSfxVolume,
      voiceVolume, setVoiceVolume
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
