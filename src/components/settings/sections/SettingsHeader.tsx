import { motion } from "framer-motion";

interface SettingsHeaderProps {
  onClose: () => void;
  showBottomCurtains: boolean;
}

export function SettingsHeader({ onClose, showBottomCurtains }: SettingsHeaderProps) {
  return (
    <div className="relative">
      {/* Top Curtain - Anchored to bottom of header line */}
      <motion.div
        className="absolute left-1/2 bottom-0 w-[150vw] h-[150vh] bg-black pointer-events-none"
        style={{ translateX: "-50%", zIndex: 102 }}
        initial={{ y: "0%" }}
        animate={{ y: "100%", transitionEnd: { opacity: 0 } }}
        exit={{ y: "0%", opacity: 1, zIndex: 102 }}
        transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
      />

      {/* Top White Curtain - Follows the Black curtain */}
      <motion.div
        className="absolute left-1/2 bottom-0 w-[150vw] h-[150vh] bg-white pointer-events-none"
        style={{ translateX: "-50%", zIndex: 101 }}
        initial={{ y: "0%" }}
        animate={{ y: "100%", transitionEnd: { opacity: 0 } }}
        exit={{ y: "0%", opacity: 1, zIndex: 101 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
      />

      {/* Bottom Curtain (Black Layer) - Moves to reveal Pink */}
      <motion.div
        className="absolute left-1/2 top-full w-[150vw] h-[150vh] bg-black pointer-events-none"
        style={{ translateX: "-50%", zIndex: 120 }}
        initial={{ y: "0%" }}
        animate={showBottomCurtains ? { y: "100%" } : { y: "0%" }}
        exit={{ y: "0%" }}
        transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
      />

      {/* Bottom Pink Curtain - Moves to reveal Content */}
      <motion.div
        className="absolute left-1/2 top-full w-[150vw] h-[150vh] bg-[#FF959E] pointer-events-none"
        style={{ translateX: "-50%", zIndex: 115 }}
        initial={{ y: "0%" }}
        animate={showBottomCurtains ? { y: "100%" } : { y: "0%" }}
        exit={{ y: "0%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
      />

      {/* Header Content */}
      <motion.div
        className="flex items-end justify-center border-b-4 border-white pb-6  relative z-60"
        initial={{ opacity: 1 }}
      >
        <h2 className="text-6xl font-bold text-white tracking-wider flex items-baseline gap-10">
          <span className="text-[#DB404A] relative inline-block px-2 text-7xl">
            <span className="absolute -left-9 top-1 text-[#DB404A] text-5xl">「</span>
            YOUR
            <span className="absolute -right-10 bottom-1 text-[#DB404A] text-5xl">」</span>
          </span>
          <span className="text-5xl">Settings</span>
        </h2>
        <button
          onClick={onClose}
          className="absolute right-0 bottom-6 text-3xl font-bold text-white hover:text-[#FF959E] transition-colors"
        >
          Return
        </button>
      </motion.div>
    </div>
  );
}
