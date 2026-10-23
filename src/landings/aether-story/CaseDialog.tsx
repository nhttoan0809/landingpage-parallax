import { useEffect, useRef } from "react";
import type { CaseStudy } from "./content";
import styles from "./Aether.module.css";

export function CaseContent({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.caseBody}>
      <p className={styles.conceptLabel}>Fictional project · Concept study</p>
      <h3>{study.line}</h3>
      <dl>
        <div>
          <dt>The question</dt>
          <dd>{study.problem}</dd>
        </div>
        <div>
          <dt>Our approach</dt>
          <dd>{study.solution}</dd>
        </div>
        <div>
          <dt>Imagined outcome</dt>
          <dd>{study.outcome}</dd>
        </div>
      </dl>
      <p className={styles.caseResult}>{study.result}</p>
      <p className={styles.caseServices}>{study.detail}</p>
    </div>
  );
}
export default function CaseDialog({
  study,
  onClose,
}: {
  study: CaseStudy;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    if (typeof element.showModal === "function") element.showModal();
    else element.setAttribute("open", "");
    close.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
      if (typeof element.close === "function") element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
        if (e.key === "Tab") {
          const items = Array.from(
            dialog.current!.querySelectorAll<HTMLElement>(
              'button, a[href], input, [tabindex="0"]',
            ),
          );
          const first = items[0],
            last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}
    >
      <div className={styles.dialogTop}>
        <span>{study.category}</span>
        <button ref={close} onClick={onClose} aria-label="Close case study">
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <h2 id="case-title">{study.name}</h2>
      <img
        src={`${import.meta.env.BASE_URL}landings/aether-story/${study.image}`}
        alt={`${study.name}: original concept illustration`}
        width="800"
        height="600"
      />
      <CaseContent study={study} />
    </dialog>
  );
}
