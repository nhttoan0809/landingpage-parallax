import { appearances, type Appearance } from "./appearances";
import type { Preset } from "./preset";
import styles from "./Aether.module.css";

type Props = {
  preset: Preset;
  onChange: (preset: Preset) => void;
  kind: "flight" | "light";
  reduced: boolean;
};
export default function ChapterControls({
  preset,
  onChange,
  kind,
  reduced,
}: Props) {
  const ranges =
    kind === "flight"
      ? [
          {
            key: "flapSpeed" as const,
            label: "Wingbeat speed",
            min: 0.25,
            max: 2,
            step: 0.05,
            description: "From a slow, deliberate beat to a spirited ascent.",
          },
          {
            key: "wingSpread" as const,
            label: "Wing openness",
            min: 0,
            max: 1,
            step: 0.01,
            description:
              "Gather the wings close, or let them reach into the air.",
          },
        ]
      : [
          {
            key: "iridescence" as const,
            label: "Iridescence",
            min: 0,
            max: 1,
            step: 0.01,
            description:
              "Turn a quiet shimmer into a brilliant spectral sheen.",
          },
          {
            key: "dispersion" as const,
            label: "Dispersion",
            min: 0,
            max: 1,
            step: 0.01,
            description:
              "Spread the spectral colours across the feather edges.",
          },
          {
            key: "glow" as const,
            label: "Inner glow",
            min: 0,
            max: 1,
            step: 0.01,
            description: "Carry a little more of the original spark.",
          },
        ];
  return (
    <fieldset className={styles.chapterControls}>
      <legend>
        {kind === "flight"
          ? "Find its rhythm"
          : "Choose how it catches the light"}
      </legend>
      {kind === "flight" && (
        <label className={styles.flightToggle}>
          <span>
            <strong>Allow wingbeats</strong>
            <small>
              {reduced
                ? "Motion is paused for your reading preference."
                : preset.flapEnabled
                  ? "Your phoenix is flying."
                  : "Your phoenix is gliding."}
            </small>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={preset.flapEnabled}
            disabled={reduced}
            onChange={(event) =>
              onChange({ ...preset, flapEnabled: event.target.checked })
            }
          />
        </label>
      )}
      {kind === "light" && (
        <div
          className={styles.appearanceChoices}
          role="radiogroup"
          aria-label="Phoenix appearance"
        >
          {Object.entries(appearances).map(([key, look]) => (
            <label key={key}>
              <input
                type="radio"
                name="appearance"
                value={key}
                checked={preset.appearance === key}
                aria-label={look.name}
                onChange={() =>
                  onChange({ ...preset, appearance: key as Appearance })
                }
              />
              <span
                className={styles.appearanceSwatch}
                style={{ background: look.swatch }}
                aria-hidden="true"
              />
              <span>{look.name}</span>
            </label>
          ))}
          <p className={styles.appearanceDescription}>
            {appearances[preset.appearance].description}
          </p>
        </div>
      )}
      {ranges.map((range) => (
        <label className={styles.range} key={range.key}>
          <span>
            {range.label}
            <output>
              {range.key === "flapSpeed"
                ? `${preset[range.key].toFixed(2)}×`
                : `${Math.round(preset[range.key] * 100)}%`}
            </output>
          </span>
          <input
            type="range"
            aria-label={range.label}
            min={range.min}
            max={range.max}
            step={range.step}
            value={preset[range.key]}
            disabled={
              (range.key === "flapSpeed" && (reduced || !preset.flapEnabled)) ||
              (range.key === "dispersion" &&
                (preset.appearance === "holo" || preset.appearance === "magma"))
            }
            onChange={(event) =>
              onChange({ ...preset, [range.key]: Number(event.target.value) })
            }
          />
          <small>
            {range.key === "dispersion" &&
            (preset.appearance === "holo" || preset.appearance === "magma")
              ? "Spectral dispersion belongs to the Iridescent form."
              : range.description}
          </small>
        </label>
      ))}
      <p className={styles.chapterHint}>
        {kind === "flight"
          ? "Keep scrolling. This rhythm travels with you."
          : "The light is yours now. Keep it for the final portrait."}
      </p>
    </fieldset>
  );
}
