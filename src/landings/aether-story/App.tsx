import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { chapters, chapterAt, progressAt } from "./story";
import { cases, type CaseStudy } from "./content";
import { defaultPreset } from "./preset";
import type { Quality } from "./scene";
import { useSound } from "./useSound";
import CaseDialog, { CaseContent } from "./CaseDialog";
import Customizer from "./Customizer";
import styles from "./Aether.module.css";

import SceneView from "./SceneView";
gsap.registerPlugin(useGSAP);
const asset = `${import.meta.env.BASE_URL}landings/aether-story/`;
export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const journey = useRef({ progress: 0 });
  const [osReduced, setOsReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [manualStatic, setManualStatic] = useState(false);
  const isStatic = osReduced || manualStatic;
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState("spark");
  const lastChapter = useRef("spark");
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [readAll, setReadAll] = useState(false);
  const [preset, setPreset] = useState({ ...defaultPreset });
  const [quality, setQuality] = useState<Quality>("auto");
  const sound = useSound();
  const onStatus = useCallback((value: boolean) => setReady(value), []);
  const goStatic = useCallback(() => setManualStatic(true), []);
  const closeCase = useCallback(() => setSelectedCase(null), []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setOsReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useGSAP(
    () => {
      if (isStatic || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const sections = [...chapters, "reimagine"].map(
        (id) => root.current!.querySelector<HTMLElement>(`#${id}`)!,
      );
      let offsets = sections.map((section) => section.offsetTop);
      const scrollPosition = { value: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sections[0],
          start: "top top",
          endTrigger: sections[4],
          end: "top top",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => {
            offsets = sections.map((section) => section.offsetTop);
          },
          onUpdate: (self) => {
            const next = chapterAt(progressAt(self.scroll() + 0.5, offsets));
            if (lastChapter.current !== next) {
              lastChapter.current = next;
              setActive(next);
            }
          },
        },
      });
      timeline.fromTo(
        scrollPosition,
        { value: 0 },
        {
          value: () => sections[4].offsetTop,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            journey.current.progress = progressAt(
              scrollPosition.value,
              offsets,
            );
          },
        },
      );
      let alive = true;
      const refresh = () => {
        if (alive) ScrollTrigger.refresh();
      };
      document.fonts?.ready.then(refresh);
      return () => {
        alive = false;
        timeline.kill();
      };
    },
    { scope: root, dependencies: [isStatic, readAll], revertOnUpdate: true },
  );
  useEffect(() => {
    if (!isStatic) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    root.current
      ?.querySelectorAll("[data-chapter]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [isStatic]);
  useEffect(() => {
    // Native hashes remain valid after fonts and the scene arrive. Never force a story start.
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return;
    const timer = setTimeout(
      () => target.scrollIntoView({ block: "start" }),
      100,
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      ref={root}
      className={styles.page}
      data-static={isStatic}
      data-ready={ready}
    >
      <a className={styles.skipLink} href="#story-content">
        Skip to story
      </a>
      {!isStatic && (
        <SceneView
          journey={journey.current}
          preset={preset}
          isStatic={false}
          quality={quality}
          onStatus={onStatus}
          onStatic={goStatic}
        />
      )}
      <header className={styles.header}>
        <a
          href="#spark"
          className={styles.wordmark}
          aria-label="Aether Studio, back to Spark"
        >
          <img src={`${asset}mark.svg`} alt="" width="32" height="32" />
          <span>
            Aether<span className={styles.studio}>Studio</span>
          </span>
        </a>
        <nav className={styles.chapterNav} aria-label="Story chapters">
          {chapters.map((chapter, i) => (
            <a
              key={chapter}
              href={`#${chapter}`}
              aria-label={`${i + 1}: ${chapter[0].toUpperCase() + chapter.slice(1)}`}
              aria-current={active === chapter ? "step" : undefined}
            >
              <span className={styles.chapterNumber}>0{i + 1}</span>
              <span className={styles.chapterName}>
                {chapter[0].toUpperCase() + chapter.slice(1)}
              </span>
            </a>
          ))}
        </nav>
        <button
          className={styles.soundButton}
          aria-pressed={sound.enabled}
          onClick={() => void sound.toggle()}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
          >
            <path d="M4 10h4l5-4v12l-5-4H4Z" />
            {sound.enabled ? (
              <path d="M16 8q6 4 0 8m3-11q9 7 0 14" />
            ) : (
              <path d="m17 9 5 6m0-6-5 6" />
            )}
          </svg>
          <span>Sound {sound.enabled ? "on" : "off"}</span>
        </button>
      </header>
      <main id="story-content" tabIndex={-1} className={styles.main}>
        <section
          id="spark"
          data-chapter
          className={`${styles.chapter} ${styles.hero}`}
          aria-labelledby="spark-title"
        >
          <div className={styles.heroCopy}>
            <p className={styles.heroNote}>An idea takes flight</p>
            <h1 id="spark-title">
              Some ideas
              <br />
              are born
              <br />
              to rise.
            </h1>
          </div>
          {(isStatic || !ready) && (
            <img
              className={styles.heroPoster}
              src={`${asset}poster.webp`}
              onError={(e) => {
                e.currentTarget.src = `${asset}poster.svg`;
              }}
              alt="A glass phoenix with a sculpted head, layered wings and a long ribbon tail"
              width="1000"
              height="1000"
            />
          )}
          <div className={styles.heroBottom}>
            <div>
              <p>
                We turn the things you imagine
                <br />
                into the things you feel.
              </p>
              <a className={styles.primaryButton} href="#formation">
                Start story <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className={styles.motionChoice}>
              <button
                className={styles.textButton}
                disabled={osReduced}
                aria-pressed={isStatic}
                onClick={() => setManualStatic(!manualStatic)}
              >
                {isStatic
                  ? osReduced
                    ? "Reduced motion is on"
                    : "Explore with motion"
                  : "Read without motion"}
              </button>
              <span>Four chapters. A new perspective.</span>
            </div>
          </div>
          <span className={styles.sideNote}>
            Independent minds. Shared possibilities.
          </span>
        </section>
        <section
          id="formation"
          data-chapter
          className={`${styles.chapter} ${styles.formation}`}
          aria-labelledby="formation-title"
        >
          <div className={styles.chapterCopy}>
            <p className={styles.chapterIndex}>02 / Formation</p>
            <h2 id="formation-title">
              Give the invisible
              <br />a form.
            </h2>
            <p>
              An idea starts as a feeling. A glimpse of something that could be.
              We follow that thread until it becomes a world you can step
              inside.
            </p>
            <div className={styles.formationNotes}>
              <p>
                <span>Find the spark</span>Listen for the thought that won’t let
                go.
              </p>
              <p>
                <span>Build the wings</span>Give every detail a reason to exist.
              </p>
              <p>
                <span>Let it move you</span>Make an experience worth
                remembering.
              </p>
            </div>
            <a className={styles.textButton} href="#resonance">
              Discover the echoes <span aria-hidden="true">↓</span>
            </a>
          </div>
          {!isStatic && (
            <div
              className={styles.formationSculpture}
              data-formation-slot
              aria-hidden="true"
            />
          )}
          {isStatic && (
            <figure className={styles.staticFigure}>
              <img
                src={`${asset}poster.webp`}
                alt="The phoenix’s individual glass feathers fan out into two open wings"
                width="1000"
                height="1000"
              />
              <figcaption>
                One possibility. Many carefully shaped parts.
              </figcaption>
            </figure>
          )}
        </section>
        <section
          id="resonance"
          data-chapter
          className={`${styles.chapter} ${styles.resonance}`}
          aria-labelledby="resonance-title"
        >
          <div className={styles.resonanceHeading}>
            <p className={styles.chapterIndex}>03 / Resonance</p>
            <h2 id="resonance-title">A story finds its echo.</h2>
            <p>
              Different worlds. The same belief in what a story can change.
              <br /> Choose a crystal to step into a concept.
            </p>
          </div>
          <div className={styles.caseGrid}>
            {cases.map((study, i) => (
              <article key={study.id} className={styles.caseCard}>
                <button
                  className={styles.crystalButton}
                  onClick={() => {
                    sound.chime(i);
                    setSelectedCase(study);
                  }}
                  onPointerEnter={() => sound.chime(i)}
                  onFocus={() => sound.chime(i)}
                  aria-label={`Explore ${study.name} case study`}
                >
                  <span className={styles.crystalSlot} data-crystal-slot>
                    <img
                      className={styles.crystalFallback}
                      src={`${asset}${study.id}-crystal.svg`}
                      alt=""
                      width="300"
                      height="240"
                    />
                  </span>
                  <span className={styles.caseCategory}>{study.category}</span>
                  <h3>{study.name}</h3>
                  <span className={styles.caseLine}>{study.line}</span>
                  <span className={styles.caseOpen}>
                    Explore concept <span aria-hidden="true">↗</span>
                  </span>
                </button>
              </article>
            ))}
          </div>
          <div className={styles.readProjects}>
            <span>Three fictional projects. Real possibilities.</span>
            <button
              aria-expanded={readAll || isStatic}
              className={styles.textButton}
              disabled={isStatic}
              onClick={() => setReadAll(!readAll)}
            >
              {readAll || isStatic
                ? "Full project stories below"
                : "Read all project stories"}
            </button>
          </div>
          {(readAll || isStatic) && (
            <div className={styles.inlineCases}>
              {cases.map((study) => (
                <article key={study.id}>
                  <h3>{study.name}</h3>
                  <img
                    loading="lazy"
                    src={`${asset}${study.image}`}
                    alt={`${study.name} concept illustration`}
                    width="800"
                    height="600"
                  />
                  <CaseContent study={study} />
                </article>
              ))}
            </div>
          )}
        </section>
        <section
          id="rebirth"
          data-chapter
          className={`${styles.chapter} ${styles.rebirth}`}
          aria-labelledby="rebirth-title"
        >
          <div>
            <p className={styles.chapterIndex}>04 / Rebirth</p>
            <h2 id="rebirth-title">
              Never the same.
              <br />
              Always becoming.
            </h2>
          </div>
          {isStatic && (
            <img
              className={styles.rebirthPoster}
              src={`${asset}poster.webp`}
              alt="The complete phoenix, restored with both wings fully open"
              width="1000"
              height="1000"
            />
          )}
          <div className={styles.rebirthBottom}>
            <p>
              What begins as a spark can become something extraordinary.
              <br /> The next possibility is yours to shape.
            </p>
            <a className={styles.primaryButton} href="#reimagine">
              Reimagine the phoenix <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <section
          id="reimagine"
          className={styles.customizer}
          aria-labelledby="reimagine-title"
        >
          <div className={styles.customizerVisual}>
            <p className={styles.chapterIndex}>An open ending</p>
            <h2 id="reimagine-title">
              Make a little light
              <br />
              your own.
            </h2>
            <p>
              Change its colour. Shift its energy.
              <br />
              See what else it could become.
            </p>
            {isStatic && (
              <div className={styles.staticPreview}>
                <img
                  src={`${asset}poster.webp`}
                  alt="Phoenix material study"
                  width="1000"
                  height="1000"
                />
                <SceneView
                  journey={journey.current}
                  preset={preset}
                  isStatic
                  preview
                  quality={quality}
                  onStatus={onStatus}
                />
              </div>
            )}
            {!ready && !isStatic && (
              <img
                className={styles.customizerPoster}
                style={{
                  filter:
                    preset.palette === "tide"
                      ? "hue-rotate(65deg)"
                      : preset.palette === "ember"
                        ? "hue-rotate(290deg)"
                        : undefined,
                }}
                src={`${asset}poster.webp`}
                alt="Illustrated phoenix preview. Live material rendering requires a compatible GPU."
                width="1000"
                height="1000"
              />
            )}
          </div>
          <Customizer
            preset={preset}
            onChange={setPreset}
            quality={quality}
            onQuality={setQuality}
          />
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a href={import.meta.env.BASE_URL}>← Return to collection</a>
          <span className={styles.footerBrand}>Aether Studio</span>
          <a href="#spark">Back to the spark ↑</a>
        </div>
        <div className={styles.footerBottom}>
          <p>
            A fictional independent creative studio.
            <br />
            All projects and outcomes are illustrative concepts.
          </p>
          <p>
            Original procedural 3D, vector art & synthesized sound.
            <br />
            Fonts: Cormorant Garamond & Manrope (OFL).
          </p>
          <p>
            Inspired by{" "}
            <a
              href="https://noomoagency.com/insights/the-power-of-digital-storytelling-website"
              target="_blank"
              rel="noreferrer"
            >
              Noomo’s digital storytelling
            </a>
            .<br />
            An independent study, with no affiliation.
          </p>
        </div>
        <div className={styles.footerTools}>
          <button
            className={styles.textButton}
            disabled={osReduced}
            onClick={() => setManualStatic(!manualStatic)}
          >
            {isStatic
              ? osReduced
                ? "Reduced motion is on"
                : "Explore with motion"
              : "Read without motion"}
          </button>
          {sound.error && <p role="status">{sound.error}</p>}
          <span>Made of possibility. © 2026 Aether concept.</span>
        </div>
      </footer>
      {selectedCase && <CaseDialog study={selectedCase} onClose={closeCase} />}
    </div>
  );
}
