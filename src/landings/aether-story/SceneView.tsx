import { useEffect, useRef, useState } from "react";
import type { Preset } from "./preset";
import type { Quality, SceneHandle } from "./scene";
import styles from "./Aether.module.css";

type Props = {
  journey: { progress: number };
  preset: Preset;
  isStatic: boolean;
  preview?: boolean;
  quality: Quality;
  onStatus: (ready: boolean) => void;
  onStatic?: () => void;
};
export default function SceneView({
  journey,
  preset,
  isStatic,
  preview = false,
  quality,
  onStatus,
  onStatic,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<SceneHandle | null>(null);
  const latestPreset = useRef(preset);
  const [status, setStatus] = useState("Preparing the glass study… 25%");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [reloadNeeded, setReloadNeeded] = useState(false);
  useEffect(() => {
    if (quality !== "auto") return;
    const query = window.matchMedia("(max-width: 767px)");
    const change = () => setAttempt((value) => value + 1);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, [quality]);
  useEffect(() => {
    latestPreset.current = preset;
    handle.current?.update(preset);
  }, [preset]);
  useEffect(() => {
    let stopped = false;
    let current: SceneHandle | null = null;
    const fail = (message: string) => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timeout);
      setStatus(message);
      setFailed(true);
      onStatus(false);
      current?.dispose();
      current = null;
      handle.current = null;
    };
    const timeout = window.setTimeout(
      () =>
        fail(
          "The 3D view took too long to open. Continue with the illustrated story or retry.",
        ),
      15000,
    );
    import("./scene")
      .then(({ createScene }) => {
        if (stopped || !canvas.current) return;
        setStatus("Shaping glass and light… 70%");
        try {
          current = createScene({
            canvas: canvas.current,
            preview,
            isStatic,
            quality,
            journey,
            preset: latestPreset.current,
            onReady: () => {
              clearTimeout(timeout);
              if (!stopped) {
                setFailed(false);
                setStatus("Glass study ready");
                onStatus(true);
              }
            },
            onError: fail,
          });
          if (stopped) {
            current.dispose();
            current = null;
          } else handle.current = current;
        } catch {
          fail(
            "The 3D view is unavailable on this device. The illustrated story and all project details are ready to read.",
          );
        }
      })
      .catch(() => {
        if (stopped) return;
        setReloadNeeded(true);
        fail(
          "The 3D view could not load. Check your connection and reload the view, or continue reading.",
        );
      });
    return () => {
      stopped = true;
      clearTimeout(timeout);
      current?.dispose();
      handle.current = null;
      onStatus(false);
    };
  }, [attempt, isStatic, journey, onStatus, preview, quality]);
  return (
    <>
      <div
        className={preview ? styles.previewScene : styles.scene}
        aria-hidden="true"
      >
        <canvas ref={canvas} key={`${attempt}-${quality}`} />
      </div>
      <div
        className={`${styles.sceneStatus} ${preview ? styles.previewStatus : ""} ${failed ? styles.sceneError : status === "Glass study ready" ? styles.visuallyHidden : ""}`}
        role="status"
        aria-live="polite"
      >
        <span>{status}</span>
        {failed && !preview && onStatic && (
          <button onClick={onStatic}>Read without motion</button>
        )}
        {failed && (
          <button
            onClick={() => {
              if (reloadNeeded) {
                window.location.reload();
                return;
              }
              setFailed(false);
              setStatus("Preparing the glass study… 25%");
              setAttempt((a) => a + 1);
            }}
          >
            {reloadNeeded ? "Reload 3D view" : "Retry 3D view"}
          </button>
        )}
      </div>
    </>
  );
}
