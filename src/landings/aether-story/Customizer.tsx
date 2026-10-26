import { useRef, useState } from "react";
import {
  defaultPreset,
  parsePreset,
  serializePreset,
  storageKey,
  type Preset,
} from "./preset";
import { appearances } from "./appearances";
import type { Quality } from "./scene";
import styles from "./Aether.module.css";

type Props = {
  preset: Preset;
  onChange: (p: Preset) => void;
  quality: Quality;
  onQuality: (q: Quality) => void;
};
export default function Customizer({
  preset,
  onChange,
  quality,
  onQuality,
}: Props) {
  const file = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("Your light, your point of view.");
  const [error, setError] = useState(false);
  const report = (text: string, failed = false) => {
    setMessage(text);
    setError(failed);
  };
  const fail = (e: unknown) =>
    report(
      e instanceof Error ? e.message : "The preset could not be opened.",
      true,
    );
  return (
    <div className={styles.controls}>
      <div className={styles.controlIntro}>
        <span>Your phoenix, gathered here</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div
        className={styles.portraitSummary}
        aria-label="Your phoenix settings"
      >
        <p>
          <span>Appearance</span>
          <strong>{appearances[preset.appearance].name}</strong>
        </p>
        <p>
          <span>Rhythm</span>
          <strong>
            {preset.flapEnabled
              ? `${preset.flapSpeed.toFixed(2)}× wingbeats`
              : "A quiet glide"}
          </strong>
        </p>
        <p>
          <span>Wings</span>
          <strong>{Math.round(preset.wingSpread * 100)}% open</strong>
        </p>
        <p>
          <span>Light</span>
          <strong>{Math.round(preset.iridescence * 100)}% iridescence</strong>
        </p>
        <a href="#formation">Revisit its rhythm ↗</a>
        <a href="#rebirth">Revisit its light ↗</a>
      </div>
      <label className={styles.quality}>
        Render quality{" "}
        <select
          value={quality}
          onChange={(e) => onQuality(e.target.value as Quality)}
        >
          <option value="auto">Automatic</option>
          <option value="high">Fine detail</option>
          <option value="low">Lighter on this device</option>
        </select>
      </label>
      <div className={styles.presetActions}>
        <button
          className={styles.primaryButton}
          onClick={() => {
            try {
              localStorage.setItem(storageKey, serializePreset(preset));
              report(
                "Preset saved on this device. Use Restore saved to load it.",
              );
            } catch {
              report(
                "Device storage is unavailable. Use Export JSON to keep your preset.",
                true,
              );
            }
          }}
        >
          Save preset <span aria-hidden="true">↓</span>
        </button>
        <button
          className={styles.textButton}
          onClick={() => {
            onChange({ ...defaultPreset });
            report("The original Iridescent study is restored.");
          }}
        >
          Reset
        </button>
      </div>
      <div className={styles.fileActions}>
        <button
          onClick={() => {
            try {
              const text = localStorage.getItem(storageKey);
              if (!text) {
                report("No saved preset yet. Choose Save preset first.", true);
                return;
              }
              onChange(parsePreset(text));
              report("Saved preset restored.");
            } catch (e) {
              fail(e);
            }
          }}
        >
          Restore saved
        </button>
        <button
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([serializePreset(preset)], { type: "application/json" }),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = `aether-${preset.appearance}.json`;
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            report("Preset exported as JSON.");
          }}
        >
          Export JSON
        </button>
        <button onClick={() => file.current?.click()}>Import JSON</button>
        <input
          ref={file}
          className={styles.visuallyHidden}
          type="file"
          tabIndex={-1}
          accept=".json,application/json"
          aria-label="Import preset JSON"
          onChange={async (e) => {
            const input = e.currentTarget;
            const selected = input.files?.[0];
            if (!selected) return;
            try {
              if (selected.size > 16384)
                throw new Error(
                  "Preset is too large. Choose a JSON file smaller than 16 KB.",
                );
              onChange(parsePreset(await selected.text()));
              report("Preset imported and applied.");
            } catch (error) {
              fail(error);
            } finally {
              input.value = "";
            }
          }}
        />
      </div>
      <p
        className={`${styles.presetMessage} ${error ? styles.errorText : ""}`}
        role={error ? "alert" : "status"}
      >
        {message}
      </p>
    </div>
  );
}
