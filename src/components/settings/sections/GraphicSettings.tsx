import { SelectorRow } from "#components/settings/components/SelectorRow";

interface GraphicSettingsProps {
  displayMode: string;
  onDisplayModeChange: (mode: string) => void;
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders display mode configuration options
export function GraphicSettings({
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
