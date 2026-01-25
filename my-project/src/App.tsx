import { useState, useEffect, useRef } from "react";
import MenuButton from "./MenuButton";

interface MenuItem {
  label: string;
  action: () => void;
}

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  //  BGM Logic //
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio("/menu_bgm.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Browser policy: Play audio after the first user interaction
    const startAudio = () => {
      audio.play().catch(() => console.log("Waiting for user interaction..."));
      window.removeEventListener("click", startAudio);
    };

    window.addEventListener("click", startAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Continue", action: () => console.log("Continue") },
    { label: "Settings", action: () => console.log("Settings") },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "Backers", action: () => console.log("Backers") },
    { label: "Exit", action: () => console.log("Exit") },
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* WRAPPER: Positioned Top-Left */}
      <div className="absolute top-10 left-20 z-20 flex flex-col items-center">
        {/* LOGO */}
        <header className="mb-6">
          <img
            src="/logo.png"
            alt="Game Logo"
            className="w-75 md:w-125 object-contain"
          />
        </header>

        {/* MENU */}
        <nav
          className="flex flex-col items-center gap-3"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {menuItems.map((item, index) => (
            <MenuButton
              key={item.label}
              label={item.label}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => setHoveredIndex(index)}
              onAction={item.action}
            />
          ))}
        </nav>
      </div>

      {/* MUTE TOGGLE */}
      <button
        onClick={toggleMute}
        className="absolute bottom-10 right-10 z-30 px-4 py-2 bg-black/50 border-2 border-white text-white font-black italic uppercase hover:bg-white hover:text-black transition-all active:scale-95 select-none"
      >
        {isMuted ? "BGM: OFF" : "BGM: ON"}
      </button>
    </main>
  );
}
