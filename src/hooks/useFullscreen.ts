import { useState, useEffect } from "react";

// Custom hook to manage and toggle fullscreen state
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state with browser fullscreen changes
  useEffect(() => {
    // Updates local state when browser fullscreen mode changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange(); // Init
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Toggles between fullscreen and windowed mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  return { isFullscreen, toggleFullscreen };
}
