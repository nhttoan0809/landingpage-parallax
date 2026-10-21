import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLenis } from "../lib/lenis";
import { Icon } from "../components/Icon";

const base = import.meta.env.BASE_URL;

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion: reduced } = useLenis();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, -190]);
  const cameraRotate = useTransform(scrollYProgress, [0, 1], [-9, 7]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1, 0.87]);

  return (
    <section
      id="hero"
      className="hero-track"
      ref={ref}
      aria-labelledby="hero-title"
    >
      <div className="hero-scene">
        <motion.div
          className="hero-landscape parallax-layer"
          data-parallax="landscape"
          style={{ y: reduced ? 0 : backgroundY }}
        >
          <img
            src={`${base}landings/luma/images/alpine-lake.jpg`}
            alt=""
            width="2000"
            height="1333"
            fetchPriority="high"
          />
        </motion.div>
        <div className="hero-atmosphere" />
        <motion.div
          className="hero-copy"
          style={{
            y: reduced ? 0 : titleY,
            opacity: reduced ? 1 : titleOpacity,
          }}
        >
          <p className="eyebrow">
            <span className="status-dot" /> Luma Field · Sinh ra để đi
          </p>
          <h1 id="hero-title">
            Đi xa hơn.
            <br />
            Giữ lại nhiều hơn.
          </h1>
          <p className="hero-description">
            Một chiếc máy ảnh nhỏ. Cả thế giới rộng lớn.
            <br className="desktop-break" /> Dành cho những khoảnh khắc ngoài dự
            định.
          </p>
          <a className="button button-dark" href="#features">
            Gặp gỡ Luma Field <Icon name="arrow" size={18} />
          </a>
        </motion.div>
        <motion.div
          className="hero-camera parallax-layer"
          data-parallax="camera"
          style={{
            y: reduced ? 0 : cameraY,
            rotate: reduced ? -5 : cameraRotate,
            scale: reduced ? 1 : cameraScale,
          }}
        >
          <img
            src={`${base}landings/luma/images/luma-camera.png`}
            alt="Máy ảnh Luma Field màu xanh rêu, thân nhôm bạc và ống kính đen"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </motion.div>
        <div className="camera-note">
          <span className="tiny-cross">+</span>
          <div>
            Luma Field<span>Nhẹ hành trang. Đậm ký ức.</span>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-caption">
            <span className="caption-line" />
            Không cần một lý do để lên đường.
          </div>
          <a href="#story" className="scroll-cue">
            <span>Cuộn để khám phá</span>
            <span className="round-icon">
              <Icon name="down" size={18} />
            </span>
          </a>
        </div>
        <div className="hero-coordinates" aria-hidden="true">
          46°35′ N &nbsp; 12°14′ E
        </div>
      </div>
    </section>
  );
}
