import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { useLenis } from "../lib/lenis";
import { Icon } from "../components/Icon";

const views = [
  {
    name: "Sương núi",
    image: "mountain-light.jpg",
    caption: "Chạm đến những khoảng trời mới.",
    detail: "Tông lạnh trong trẻo · Chi tiết dịu nhẹ",
    alt: "Đỉnh núi phủ tuyết nổi bật giữa những đám mây",
  },
  {
    name: "Nắng rừng",
    image: "forest-light.jpg",
    caption: "Lạc một chút. Tìm thấy nhiều hơn.",
    detail: "Sắc xanh sâu · Ánh sáng tự nhiên",
    alt: "Rừng cây xanh với nắng len qua tán lá",
  },
  {
    name: "Biển sớm",
    image: "coast-light.jpg",
    caption: "Để một ngày bắt đầu thật chậm.",
    detail: "Sắc biển dịu · Tương phản mềm",
    alt: "Những lớp sóng biển xanh nối nhau chạy vào bờ",
  },
];

export default function GallerySection() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { prefersReducedMotion: reduced } = useLenis();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const view = views[selected];

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft")
      next = (index + views.length - 1) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="gallery"
      className="gallery-section"
      aria-labelledby="gallery-title"
    >
      <div className="section-container section-heading">
        <div>
          <p className="eyebrow">Một thế giới. Nhiều cách cảm nhận.</p>
          <h2 id="gallery-title">
            Góc nhìn của bạn.
            <br />
            Chất màu của Field.
          </h2>
        </div>
        <div className="gallery-intro">
          <p>
            Ba cảm hứng màu cho ba nhịp khám phá.
            <br />
            Chọn một góc nhìn, bắt đầu câu chuyện.
          </p>
          <div
            className="gallery-tabs"
            role="tablist"
            aria-label="Cảm hứng màu ảnh"
          >
            {views.map((item, index) => (
              <button
                key={item.name}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                id={`view-tab-${index}`}
                role="tab"
                aria-selected={selected === index}
                aria-controls="view-panel"
                tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={ref}
        id="view-panel"
        role="tabpanel"
        aria-labelledby={`view-tab-${selected}`}
        tabIndex={0}
        className="gallery-window"
      >
        <motion.img
          key={view.image}
          className="gallery-photo parallax-layer"
          src={`${import.meta.env.BASE_URL}landings/luma/images/${view.image}`}
          alt={view.alt}
          width="2000"
          height="1333"
          loading="lazy"
          style={{ y: reduced ? 0 : y }}
        />
        <div className="gallery-shade" />
        <span className="viewfinder-corner top-left" aria-hidden="true" />
        <span className="viewfinder-corner top-right" aria-hidden="true" />
        <span className="viewfinder-corner bottom-left" aria-hidden="true" />
        <span className="viewfinder-corner bottom-right" aria-hidden="true" />
        <div className="viewfinder-top">
          <span>
            <span className="live-dot" /> FIELD NOTES
          </span>
          <Icon name="aperture" size={22} />
        </div>
        <div className="viewfinder-center" aria-hidden="true">
          +
        </div>
        <div className="gallery-caption">
          <div>
            <span className="gallery-mode">{view.name}</span>
            <h3>{view.caption}</h3>
            <p>{view.detail}</p>
          </div>
          <span className="gallery-counter">
            0{selected + 1}
            <span> / 03</span>
          </span>
        </div>
      </div>
      <p className="gallery-footnote section-container">
        Hình ảnh thiên nhiên minh họa cảm hứng màu, không phải ảnh chụp từ sản
        phẩm.
      </p>
    </section>
  );
}
