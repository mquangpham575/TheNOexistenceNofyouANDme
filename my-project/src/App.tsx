import React, { useState } from "react";
import { motion } from "framer-motion";
import MenuButton from "./MenuButton";

interface MenuItem {
  label: string;
  action: () => void;
}

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuItems: MenuItem[] = [
    { label: "Continue", action: () => console.log("Continue") },
    { label: "Fleeting Memories", action: () => console.log("Memories") },
    { label: "System Config", action: () => console.log("Settings") },
    { label: "Backers", action: () => console.log("Backers") },
    { label: "Exit Game", action: () => console.log("Exit") },
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* Main UI */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-10 md:px-0">
        <header className="mb-20">
          <h1 className="text-6xl md:text-3xl font-black text-white ">
            The NOexistenceN of you AND me
          </h1>
        </header>

        {/* Navigation */}
        <nav
          className="relative flex flex-col w-fit"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* THE MASTER HIGHLIGHT BAR */}
          <motion.div
            className="absolute left-[-100px] z-0 pointer-events-none"
            initial={false}
            animate={{
              opacity: hoveredIndex !== null ? 1 : 0,
              y: hoveredIndex !== null ? hoveredIndex * 64 : 0,
            }}
            style={{
              width: "150%",
              height: "64px",
              backgroundColor: "#d33a4f",
              borderTop: "4px solid #000000",
              borderBottom: "4px solid #000000",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            {/* White Gradient Fade */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.6) 75%, transparent 100%)",
                mixBlendMode: "overlay",
              }}
            />
            {/* Curved Swoosh Overlay */}
            <div
              className="absolute inset-0 opacity-40 bg-white"
              style={{
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                filter: "blur(20px)",
                transform: "scaleX(0.8) translateX(10%)",
              }}
            />
          </motion.div>

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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-30" />
    </main>
  );
}
