import { SliderRow } from "#components/settings/components/SliderRow";

interface TextSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

export function TextSettings({ onMouseEnter, onMouseLeave }: TextSettingsProps) {
  return (
    <SliderRow
      label="Text Speed"
      subtitle="Want me to speak faster or slower ? No problem at all!"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
