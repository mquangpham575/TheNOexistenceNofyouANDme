import { SliderRow } from "./SliderRow";

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
