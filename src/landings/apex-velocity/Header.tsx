import { useRef, useState } from "react";
import styles from "./Apex.module.css";
const links = [
  ["#story", "The driver"],
  ["#world", "On / off track"],
  ["#collection", "The helmets"],
] as const;
export default function Header() {
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const previousOverflow = useRef("");
  const close = () => {
    dialog.current?.close();
    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <header className={styles.header}>
      <a
        className={styles.brand}
        href="#intro"
        aria-label="Apex Velocity, back to intro"
      >
        <svg viewBox="0 0 48 36" aria-hidden="true">
          <path
            d="M0 34 24 0h12L13 34Zm22 0L42 6h6L29 34Z"
            fill="currentColor"
          />
        </svg>
        <span>
          APEX
          <br />
          VELOCITY
        </span>
      </a>
      <nav className={styles.desktopNav} aria-label="Main navigation">
        {links.map(([href, text]) => (
          <a key={href} href={href}>
            {text}
          </a>
        ))}
      </nav>
      <a className={styles.headerCta} href="#configure">
        Make it yours <span aria-hidden="true">↗</span>
      </a>
      <button
        ref={trigger}
        type="button"
        className={styles.menuTrigger}
        aria-expanded={open}
        aria-controls="apex-menu"
        aria-label="Open navigation menu"
        onClick={() => {
          previousOverflow.current = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        Menu <span aria-hidden="true">☰</span>
      </button>
      <dialog
        id="apex-menu"
        className={styles.menu}
        ref={dialog}
        aria-label="Navigation menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
          if (event.key === "Tab") {
            const items =
              dialog.current?.querySelectorAll<HTMLElement>("button,a[href]");
            if (!items?.length) return;
            const first = items[0],
              last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className={styles.menuTop}>
          <span>Apex Velocity</span>
          <button type="button" onClick={close} autoFocus>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[...links, ["#configure", "Make it yours"]].map(([href, text]) => (
            <a
              href={href}
              key={href}
              onClick={() => {
                close();
                requestAnimationFrame(() =>
                  document
                    .querySelector<HTMLElement>(href)
                    ?.focus({ preventScroll: true }),
                );
              }}
            >
              {text}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <p>Find your line. Make your mark.</p>
      </dialog>
    </header>
  );
}
