import { useRef, useEffect } from "react";

// Custom hook to handle audio playback with volume control and click interaction
export function useAudio(volume: number, src: string, loop: boolean = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update volume dynamically when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Adjustment: Normalizes 0-100 to 0.0-1.0
    }
  }, [volume]);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume / 100; // Adjustment: Normalizes 0-100 to 0.0-1.0
    audioRef.current = audio;

    // Auto-play on first click to bypass browser autoplay policies
    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, loop]); // Re-init only if source changes

  return audioRef;
}
