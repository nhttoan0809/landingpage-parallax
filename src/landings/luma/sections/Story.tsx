import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Icon } from "../components/Icon";
import { useLenis } from "../lib/lenis";

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion: reduced } = useLenis();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <div className="section-container story-intro">
        <div>
          <p className="eyebrow">Bỏ túi máy ảnh. Mở lòng với thế giới.</p>
          <h2 id="story-title">
            Có những điều
            <br />
            chỉ thấy khi đi.
          </h2>
        </div>
        <div className="story-description">
          <p>
            Một tia nắng xuyên qua tán lá. Con đường rẽ khỏi bản đồ. Một buổi
            sáng bạn muốn nhớ mãi.
          </p>
          <p>
            Luma Field được hình dung cho những ngày như thế. Vừa đủ nhỏ để luôn
            mang theo, vừa đủ tinh tế để giữ lại cảm giác của mỗi chuyến đi.
          </p>
          <a className="text-link" href="#features">
            Thiết kế cho sự tự do <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
      <div className="forest-window" ref={ref}>
        <motion.img
          className="forest-photo parallax-layer"
          data-parallax="forest"
          src={`${import.meta.env.BASE_URL}landings/luma/images/forest-light.jpg`}
          width="2000"
          height="1333"
          loading="lazy"
          alt="Ánh nắng xuyên qua những tán cây trong khu rừng xanh"
          style={{ y: reduced ? 0 : y }}
        />
        <div className="forest-shade" />
        <div className="forest-copy">
          <Icon name="aperture" size={37} />
          <p>
            Ít màn hình hơn.
            <br />
            Nhiều thế giới hơn.
          </p>
        </div>
        <div className="photo-caption">
          <span>Những điều bình dị, qua một góc nhìn khác.</span>
          <span>Ra ngoài. Nhìn kỹ. Cảm nhận.</span>
        </div>
      </div>
    </section>
  );
}
