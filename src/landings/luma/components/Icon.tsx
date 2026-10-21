import type { CSSProperties } from "react";

type IconName =
  | "arrow"
  | "down"
  | "aperture"
  | "mountain"
  | "sun"
  | "feather"
  | "check"
  | "close"
  | "menu"
  | "download";
const paths: Record<Exclude<IconName, "aperture">, string> = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  down: "M12 4v16m-6-6 6 6 6-6",
  mountain: "m2 19 7-13 5 8 3-5 5 10H2Zm4-7 3 2 2-2",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  feather: "M5 20 16 9M5 20l1-7L15 4a4.2 4.2 0 0 1 6 6l-9 9-7 1Zm5-5h6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 8h16M4 16h16",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
};

export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {name === "aperture" ? (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="m14 2 6 10m-1 7H7M3 16 9 5m-5 1h12m6 3-6 11M10 22 4 12" />
        </>
      ) : (
        <path d={paths[name]} />
      )}
    </svg>
  );
}
