// Defines structure for volume settings
export interface SettingsState {
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
}

// Defines structure for main menu items
export interface MenuItem {
  label: string;
  action: () => void;
}
