import { useCallback, useEffect, useRef, useState } from "react";

export function useSound() {
  const audio = useRef<{ context: AudioContext; master: GainNode } | null>(
    null,
  );
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  const lastNote = useRef(0);
  const toggle = useCallback(async () => {
    if (audio.current) {
      const old = audio.current;
      audio.current = null;
      setEnabled(false);
      await old.context.close();
      return;
    }
    try {
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = 0.035;
      master.connect(context.destination);
      for (const frequency of [110, 164.81, 220.0]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.value = 0.25;
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start();
      }
      audio.current = { context, master };
      await context.resume();
      setEnabled(true);
      setError("");
    } catch {
      if (audio.current) void audio.current.context.close();
      audio.current = null;
      setEnabled(false);
      setError("Sound is unavailable in this browser.");
    }
  }, []);
  const chime = useCallback((index: number) => {
    const a = audio.current;
    if (
      !a ||
      a.context.state !== "running" ||
      performance.now() - lastNote.current < 180
    )
      return;
    lastNote.current = performance.now();
    const now = a.context.currentTime;
    const oscillator = a.context.createOscillator();
    const envelope = a.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime([523.25, 659.25, 783.99][index], now);
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.8, now + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    oscillator.connect(envelope);
    envelope.connect(a.master);
    oscillator.start(now);
    oscillator.stop(now + 1.3);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }, []);
  useEffect(() => {
    const visibility = () => {
      const context = audio.current?.context;
      if (!context) return;
      void (document.hidden ? context.suspend() : context.resume()).catch(() =>
        setError("Tap Sound off, then Sound on to resume audio."),
      );
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      if (audio.current) void audio.current.context.close();
      audio.current = null;
    };
  }, []);
  return { enabled, error, toggle, chime };
}
