import { useState } from "react";
import MenuButton from "./MenuButton";

interface MenuItem {
  label: string;
  action: () => void;
}

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      {/* WRAPPER: Positioned Top-Left (absolute) */}
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
    </main>
  );
}
