import { createContext, useContext, useState, type ReactNode } from "react";

// Defines the shape of the settings context state
interface SettingsContextType {
  bgmVolume: number;
  setBgmVolume: (vol: number) => void;
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;
  voiceVolume: number;
  setVoiceVolume: (vol: number) => void;
}

// Creates the context with undefined default value
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// Provider component that wraps the app and manages global settings state
export function SettingsProvider({ children }: { children: ReactNode }) {
  // Default volume levels
  const [bgmVolume, setBgmVolume] = useState(65); // Adjustment: Default BGM volume (0-100)
  const [sfxVolume, setSfxVolume] = useState(65); // Adjustment: Default SFX volume (0-100)
  const [voiceVolume, setVoiceVolume] = useState(80); // Adjustment: Default Voice volume (0-100)

  return (
    <SettingsContext.Provider
      value={{
        bgmVolume,
        setBgmVolume,
        sfxVolume,
        setSfxVolume,
        voiceVolume,
        setVoiceVolume,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Hook to access settings context; throws error if used outside provider
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
