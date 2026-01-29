import { useState } from "react";
import { SelectorRow } from "./SelectorRow";

interface GeneralSettingsProps {
  onMouseEnter: (subtitle: string) => void;
  onMouseLeave: () => void;
}

// Renders language and localization options
export function GeneralSetting({
  onMouseEnter,
  onMouseLeave,
}: GeneralSettingsProps) {
  const [voiceLang, setVoiceLang] = useState("Japanese");
  const [textLang, setTextLang] = useState("English");

  return (
    <>
      <SelectorRow
        label="Voice Language"
        options={["Chinese", "Japanese"]}
        selected={voiceLang}
        onSelect={setVoiceLang}
        subtitle="Magical Girl Lilth can do anything!"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <SelectorRow
        label="Language"
        options={["简体中文", "繁體中文", "English", "日本語"]}
        selected={textLang}
        onSelect={setTextLang}
        subtitle="How would you like the world's symbols to appear?"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
}
