export interface SettingsState {
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
}

export interface MenuItem {
  label: string;
  action: () => void;
}
