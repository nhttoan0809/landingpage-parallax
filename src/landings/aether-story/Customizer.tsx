import { useRef, useState } from "react";
import {
  defaultPreset,
  palettes,
  parsePreset,
  serializePreset,
  storageKey,
  type Preset,
} from "./preset";
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
        <span>Material study</span>
        <span aria-hidden="true">↗</span>
      </div>
      <fieldset className={styles.palette}>
        <legend>Choose a palette</legend>
        <div>
          {Object.entries(palettes).map(([key, p]) => (
            <label
              key={key}
              style={{ "--swatch": p.color } as React.CSSProperties}
            >
              <input
                type="radio"
                name="palette"
                value={key}
                checked={preset.palette === key}
                onChange={() => {
                  onChange({ ...preset, palette: key as Preset["palette"] });
                  report(`${p.name} palette applied.`);
                }}
              />
              <span className={styles.swatch} aria-hidden="true" />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className={styles.range}>
        <span>
          Dispersion <output>{Math.round(preset.dispersion * 100)}%</output>
        </span>
        <input
          aria-label="Dispersion"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={preset.dispersion}
          onChange={(e) =>
            onChange({ ...preset, dispersion: Number(e.target.value) })
          }
        />
        <small>From quiet glass to a spectrum of colour.</small>
      </label>
      <label className={styles.range}>
        <span>
          Inner glow <output>{Math.round(preset.glow * 100)}%</output>
        </span>
        <input
          aria-label="Inner glow"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={preset.glow}
          onChange={(e) =>
            onChange({ ...preset, glow: Number(e.target.value) })
          }
        />
        <small>A little energy, held in the light.</small>
      </label>
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
            report("The original Opal study is restored.");
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
            link.download = `aether-${preset.palette}.json`;
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
