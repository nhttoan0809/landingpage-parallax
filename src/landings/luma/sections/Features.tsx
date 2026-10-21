import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Icon } from "../components/Icon";
import { useLenis } from "../lib/lenis";

const features = [
  {
    icon: "aperture" as const,
    title: "Giữ trọn từng sắc độ.",
    text: "Cảm biến APS-C 24 MP và ống kính 28 mm f/2.8. Từ bầu trời rộng đến những chi tiết bạn suýt bỏ qua.",
    detail: "24 MP / APS-C",
  },
  {
    icon: "feather" as const,
    title: "Nhẹ như một ý định.",
    text: "Thân máy 320 g, gọn trong lòng bàn tay. Thêm một người bạn đồng hành, bớt một điều phải cân nhắc.",
    detail: "320 g / Sẵn sàng lên đường",
  },
  {
    icon: "sun" as const,
    title: "Chạm vào, rồi chụp.",
    text: "Vòng xoay vật lý và ba công thức màu riêng. Để bạn dành thời gian cho khung cảnh, thay vì những menu.",
    detail: "3 sắc màu / Một chất riêng",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion: reduced } = useLenis();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-13, 6]);
  return (
    <section
      id="features"
      className="features-section section-container"
      aria-labelledby="features-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nhỏ gọn bên ngoài. Rộng mở bên trong.</p>
          <h2 id="features-title">
            Mang ít hơn.
            <br />
            Trải nghiệm nhiều hơn.
          </h2>
        </div>
        <p>
          Chỉ giữ lại những gì cần thiết.
          <br />
          Để mỗi lần bấm máy đều tự nhiên.
        </p>
      </div>
      <div className="feature-layout">
        <div className="product-study" ref={ref}>
          <span className="study-label">Luma Field / Phiên bản Rêu rừng</span>
          <div className="study-orbit" aria-hidden="true" />
          <div className="study-orbit orbit-two" aria-hidden="true" />
          <motion.img
            src={`${import.meta.env.BASE_URL}landings/luma/images/luma-camera.png`}
            alt="Chi tiết thiết kế vòng xoay, thân nhôm và ống kính của Luma Field"
            width="1536"
            height="1024"
            loading="lazy"
            data-parallax="product"
            style={{ y: reduced ? 0 : y, rotate: reduced ? -6 : rotate }}
          />
          <div className="study-footer">
            <span>Thiết kế để luôn ở bên bạn.</span>
            <Icon name="aperture" size={24} />
          </div>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <article key={feature.title} className="feature-item">
              <div className="feature-icon">
                <Icon name={feature.icon} size={24} />
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-detail">{feature.detail}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
