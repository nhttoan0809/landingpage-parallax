import { useEffect, useRef, useState } from "react";
import type { Variant } from "./variants";
import type { Motion, mountViewer } from "./viewer-engine";
import styles from "./Apex.module.css";
type Controller = ReturnType<typeof mountViewer>;
const defaultMotion: Motion = { angle: 0, scale: 1, tilt: 0.04 };
export default function HelmetViewer({
  variant,
  motion = defaultMotion,
  staticMode = false,
  label = "Helmet viewer",
}: {
  variant: Variant;
  motion?: Motion;
  staticMode?: boolean;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null),
    api = useRef<Controller | null>(null),
    latest = useRef(variant);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    latest.current = variant;
    api.current?.update(variant);
  }, [variant]);
  useEffect(() => {
    if (staticMode || !host.current) return;
    let cancelled = false,
      started = false;
    const element = host.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();
        setStatus("loading");
        import("./viewer-engine")
          .then(({ mountViewer }) => {
            if (cancelled) return;
            try {
              api.current = mountViewer(
                element,
                latest.current,
                motion,
                () => setStatus("ready"),
                () => setStatus("error"),
              );
            } catch {
              setStatus("error");
            }
          })
          .catch(() => {
            if (!cancelled) setStatus("error");
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, [staticMode, motion]);
  const showPoster = staticMode || status !== "ready";
  return (
    <div
      className={styles.viewer}
      role="group"
      aria-label={label}
      data-viewer-state={staticMode ? "static" : status}
    >
      <div
        className={styles.renderHost}
        ref={host}
        style={{ visibility: showPoster ? "hidden" : "visible" }}
      />
      {showPoster && (
        <img
          className={styles.poster}
          src={`${import.meta.env.BASE_URL}landings/apex-velocity/${variant.id}.webp`}
          alt={`${variant.name} full-face helmet in ${variant.finish.toLowerCase()}, with dark visor and Apex graphics`}
          width="900"
          height="900"
        />
      )}
      <div className={styles.viewerBottom}>
        <span className={styles.viewerHint} role="status">
          {staticMode
            ? "Static studio view"
            : status === "error"
              ? "3D unavailable. Your selection still works."
              : status === "loading"
                ? "Preparing the studio…"
                : "Drag to explore · scroll to continue"}
        </span>
        {!staticMode && status === "ready" && (
          <div className={styles.viewerControls}>
            <button
              type="button"
              aria-label="Rotate helmet left"
              onClick={() => api.current?.rotate(-Math.PI / 5)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Reset helmet rotation"
              onClick={() => api.current?.reset()}
            >
              ↺
            </button>
            <button
              type="button"
              aria-label="Rotate helmet right"
              onClick={() => api.current?.rotate(Math.PI / 5)}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
