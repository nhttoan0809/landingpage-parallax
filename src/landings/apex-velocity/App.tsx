import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Header from "./Header";
import HelmetViewer from "./HelmetViewer";
import { downloadConfiguration, variants } from "./variants";
import styles from "./Apex.module.css";
gsap.registerPlugin(ScrollTrigger, useGSAP);
const asset = (name: string) =>
  `${import.meta.env.BASE_URL}landings/apex-velocity/${name}`;
const milestones = [
  {
    year: "The beginning",
    title: "Instinct comes first.",
    text: "A borrowed kart. A damp track. Alex Vale found his line long before he had a plan. That first feeling still leads the way.",
  },
  {
    year: "The work",
    title: "Earn the next tenth.",
    text: "Early starts, late braking, another lap. The pursuit is never a perfect number. It is finding something you could not do yesterday.",
  },
  {
    year: "The next chapter",
    title: "Leave your own mark.",
    text: "Apex Velocity is Alex’s imagined racing world: independent in spirit, precise by design. Three helmets. One unmistakable point of view.",
  },
];
export default function App() {
  const root = useRef<HTMLDivElement>(null),
    storyMotion = useRef({ angle: 0, scale: 1, tilt: 0.04 }),
    heroMotion = useRef({ angle: 0, scale: 1, tilt: 0.04 });
  const [selected, setSelected] = useState(0),
    [staticMode, setStaticMode] = useState(false),
    [downloaded, setDownloaded] = useState(false);
  const variant = variants[selected];
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-line]", {
          yPercent: 110,
          stagger: 0.1,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.1,
        });
        gsap.from("[data-hero-reveal]", {
          opacity: 0,
          y: 14,
          duration: 0.7,
          delay: 0.5,
        });
        gsap.to(heroMotion.current, {
          angle: 0.45,
          scale: 0.91,
          ease: "none",
          scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        gsap.from("[data-collection-word]", {
          yPercent: 105,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#collection",
            start: "top 80%",
            once: true,
          },
        });
        gsap.fromTo(
          "[data-world-image]",
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.1,
            stagger: 0.16,
            ease: "power3.inOut",
            scrollTrigger: { trigger: "#world", start: "top 65%", once: true },
          },
        );
      });
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: "#story",
              start: "top 78px",
              end: "+=1000",
              pin: "[data-story-panel]",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(
              storyMotion.current,
              {
                angle: 2.2,
                scale: 1.08,
                tilt: -0.12,
                duration: 1,
                ease: "none",
              },
              0,
            )
            .to(
              "[data-story-heading]",
              { x: -30, y: -18, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              "[data-story-track]",
              { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
              {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                rotation: -12,
                duration: 1,
                ease: "none",
              },
              0,
            )
            .from(
              "[data-milestone]",
              { y: 28, stagger: 0.2, duration: 0.35 },
              0.05,
            );
        },
      );
      let active = true;
      const initialHash = window.location.hash;
      document.fonts?.ready.then(() => {
        if (!active) return;
        ScrollTrigger.refresh();
        // Pin spacing and local fonts settle after the browser's initial hash jump.
        if (initialHash && window.location.hash === initialHash)
          requestAnimationFrame(() => {
            if (!active) return;
            const target = document.getElementById(initialHash.slice(1));
            target?.scrollIntoView({ behavior: "instant", block: "start" });
            target?.focus({ preventScroll: true });
          });
      });
      return () => {
        active = false;
        media.revert();
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} className={styles.page}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <section
          id="intro"
          tabIndex={-1}
          className={styles.hero}
          aria-labelledby="intro-heading"
        >
          <div className={styles.heroTop}>
            <p>
              <span className={styles.liveDot} /> Alex Vale{" "}
              <span className={styles.separator}>/</span> Driver 27
            </p>
            <p>
              Independent spirit.
              <br />
              Uncompromising intent.
            </p>
          </div>
          <div className={styles.heroTrack} aria-hidden="true">
            <svg viewBox="0 0 700 700">
              <path
                d="M530 70C270-10 60 150 100 365s350 370 455 150-100-350-225-190 80 290 160 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="72"
              />
            </svg>
          </div>
          <div className={styles.heroCopy}>
            <h1 id="intro-heading">
              {["CHASE ", "THE EDGE."].map((line) => (
                <span className={styles.line} key={line}>
                  <span data-hero-line>{line}</span>
                </span>
              ))}
            </h1>
            <div data-hero-reveal className={styles.heroIntro}>
              <p>
                Every corner is a chance.
                <br />
                Every detail, a statement.
              </p>
              <a className={styles.darkButton} href="#collection">
                Explore the helmets <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className={styles.heroViewer}>
            <HelmetViewer
              variant={variant}
              motion={heroMotion.current}
              staticMode={staticMode}
              label="Hero helmet viewer"
            />
          </div>
          <span className={styles.heroNumber} aria-hidden="true">
            27
          </span>
          <div className={styles.heroBottom}>
            <span>Find your line. Make your mark.</span>
            <a href="#story">
              Scroll to discover <span aria-hidden="true">↓</span>
            </a>
            <button
              type="button"
              aria-pressed={staticMode}
              onClick={() => setStaticMode(!staticMode)}
            >
              {staticMode ? "Enable 3D" : "Use static view"}{" "}
              <span aria-hidden="true">◈</span>
            </button>
          </div>
        </section>
        <div className={styles.ribbon} aria-hidden="true">
          <span>Precision in the details</span>
          <svg viewBox="0 0 48 36">
            <path
              d="M0 34 24 0h12L13 34Zm22 0L42 6h6L29 34Z"
              fill="currentColor"
            />
          </svg>
          <span>Instinct at the limit</span>
          <svg viewBox="0 0 48 36">
            <path
              d="M0 34 24 0h12L13 34Zm22 0L42 6h6L29 34Z"
              fill="currentColor"
            />
          </svg>
          <span>Always looking forward</span>
        </div>
        <section
          id="story"
          tabIndex={-1}
          className={styles.story}
          aria-labelledby="story-heading"
        >
          <div className={styles.storyPanel} data-story-panel>
            <div
              className={styles.storyTrack}
              data-story-track
              aria-hidden="true"
            />
            <div className={styles.storyIntro}>
              <p className={styles.sectionLabel}>Behind the visor</p>
              <h2 id="story-heading" data-story-heading>
                A FRACTION
                <br />
                CHANGES
                <br />
                EVERYTHING.
              </h2>
              <p>
                “Speed is a feeling. The rest
                <br />
                is learning to trust it.”
              </p>
              <span className={styles.signature}>Alex Vale / 27</span>
            </div>
            <div className={styles.storyViewer}>
              <HelmetViewer
                variant={variant}
                motion={storyMotion.current}
                staticMode={staticMode}
                label="Story helmet viewer"
              />
            </div>
            <div className={styles.milestones}>
              {milestones.map((item, index) => (
                <article key={item.year} data-milestone>
                  <span className={styles.milestoneLabel}>
                    <b>0{index + 1}</b> {item.year}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="world"
          tabIndex={-1}
          className={styles.world}
          aria-labelledby="world-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="world-heading">
              SAME DRIVE.
              <br />
              DIFFERENT WORLDS.
            </h2>
            <p>
              Chasing the limit. Finding the balance.
              <br />
              There is more than one way to move.
            </p>
          </div>
          <div className={styles.worldGrid}>
            <article>
              <div className={styles.worldImage} data-world-image>
                <img
                  src={asset("on-track.svg")}
                  alt="Original overhead circuit illustration with an orange racing line and apex markers"
                  loading="lazy"
                  width="900"
                  height="680"
                />
                <span className={styles.worldTag}>On track</span>
              </div>
              <div className={styles.worldText}>
                <div>
                  <h3>All in. Every lap.</h3>
                  <p>
                    The brake point. The turn-in. The tiny decisions that make
                    the difference. A life spent looking for the next tenth.
                  </p>
                </div>
                <a href="#story" aria-label="Read Alex’s racing story">
                  The driver’s mindset <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
            <article>
              <div
                className={`${styles.worldImage} ${styles.offTrack}`}
                data-world-image
              >
                <img
                  src={asset("off-track.svg")}
                  alt="Original coastal study with a sun, layered teal sea and a winding orange path"
                  loading="lazy"
                  width="900"
                  height="680"
                />
                <span className={styles.worldTag}>Off track</span>
              </div>
              <div className={styles.worldText}>
                <div>
                  <h3>Take the long way.</h3>
                  <p>
                    Salt air, a sketchbook and no stopwatch. The space away from
                    the circuit is where the next idea finds its shape.
                  </p>
                </div>
                <a href="#saltline">
                  Meet the Saltline edition <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        </section>
        <section
          id="collection"
          tabIndex={-1}
          className={styles.collection}
          aria-labelledby="collection-heading"
        >
          <div className={styles.collectionTop}>
            <p className={styles.sectionLabel}>
              The helmet collection / Vol. 01
            </p>
            <h2 id="collection-heading">
              {["THREE LINES. ", "ONE INSTINCT."].map((word) => (
                <span className={styles.line} key={word}>
                  <span data-collection-word>{word}</span>
                </span>
              ))}
            </h2>
            <p>
              Different expressions of the same obsession.
              <br />
              Choose the one that feels like you.
            </p>
          </div>
          <div
            className={styles.variantGrid}
            aria-label="Choose a helmet edition"
          >
            {variants.map((item, index) => (
              <button
                type="button"
                key={item.id}
                id={item.id}
                aria-pressed={selected === index}
                className={`${styles.variantCard} ${selected === index ? styles.selectedCard : ""}`}
                onClick={() => {
                  setSelected(index);
                  setDownloaded(false);
                }}
              >
                <div className={styles.variantImage}>
                  <img
                    src={asset(`${item.id}.webp`)}
                    alt={`${item.name}: ${item.finish.toLowerCase()} helmet`}
                    width="600"
                    height="600"
                    loading="lazy"
                  />
                  <span className={styles.variantEdition}>{item.edition}</span>
                  <span className={styles.selectionIcon} aria-hidden="true">
                    {selected === index ? "✓" : "+"}
                  </span>
                </div>
                <div className={styles.variantName}>
                  <h3>{item.name}</h3>
                  <span
                    style={{ background: item.shell }}
                    className={styles.swatch}
                  />
                </div>
                <p>{item.mood}</p>
                <span className={styles.variantFinish}>
                  {item.finish} /{" "}
                  {selected === index ? "Selected" : "Select edition"}
                </span>
              </button>
            ))}
          </div>
          <div
            id="configure"
            tabIndex={-1}
            className={styles.configure}
            aria-labelledby="configure-heading"
          >
            <div className={styles.configureViewer}>
              <span className={styles.studioLabel}>
                The studio <span>360°</span>
              </span>
              <HelmetViewer
                variant={variant}
                staticMode={staticMode}
                label="Configuration helmet viewer"
              />
            </div>
            <div className={styles.configureDetails}>
              <p className={styles.sectionLabel}>Your line. Your signature.</p>
              <div aria-live="polite" aria-atomic="true">
                <h2 id="configure-heading">{variant.name}</h2>
                <p className={styles.variantDescription}>
                  {variant.description}
                </p>
                <dl>
                  <div>
                    <dt>Edition</dt>
                    <dd>{variant.edition} / Concept series</dd>
                  </div>
                  <div>
                    <dt>Shell</dt>
                    <dd>{variant.material}</dd>
                  </div>
                  <div>
                    <dt>Finish</dt>
                    <dd>{variant.finish}</dd>
                  </div>
                  <div>
                    <dt>Visor</dt>
                    <dd>Reflective smoked polycarbonate</dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                className={styles.darkButton}
                onClick={() => {
                  downloadConfiguration(variant);
                  setDownloaded(true);
                }}
              >
                Download your configuration <span aria-hidden="true">↓</span>
              </button>
              <p className={styles.downloadNote} role="status">
                {downloaded
                  ? `${variant.name} configuration downloaded.`
                  : "A little piece of the grid. Save your selection as JSON."}
              </p>
              <a className={styles.textLink} href="#collection">
                Choose another edition <span aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerHeadline}>
          SEE YOU AT
          <br />
          THE NEXT APEX.
          <a href="#intro" aria-label="Back to top">
            ↗
          </a>
        </div>
        <div className={styles.footerLinks}>
          <a href={import.meta.env.BASE_URL}>↖ Return to collection</a>
          <p>Apex Velocity / An independent racing concept</p>
          <a href={asset("credits.txt")}>Asset credits ↗</a>
        </div>
        <p className={styles.disclosure}>
          A fictional driver and helmet collection, created for a design study.
          No affiliation with a real driver or team. Illustrations and 3D helmet
          created for Apex Velocity. Fonts: Barlow & Barlow Condensed by Jeremy
          Tribby, SIL OFL.
        </p>
      </footer>
    </div>
  );
}
