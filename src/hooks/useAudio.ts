import { useRef, useEffect } from "react";

export function useAudio(volume: number, src: string, loop: boolean = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume / 100;
    audioRef.current = audio;

    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
    };
  }, [src, loop]); // Re-init only if source changes

  return audioRef;
}
