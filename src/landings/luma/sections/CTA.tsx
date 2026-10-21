import { useRef, useState } from "react";
import { Icon } from "../components/Icon";

const colors = [
  { name: "Rêu rừng", value: "#5b6b52", filter: "none" },
  { name: "Đá núi", value: "#686e73", filter: "grayscale(1)" },
  { name: "Cát sớm", value: "#b39b7b", filter: "sepia(.55) saturate(.75)" },
];

export default function CTASection() {
  const [color, setColor] = useState(0);
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = colors[color];

  const downloadConfiguration = () => {
    const content = `LUMA FIELD — Bộ máy của bạn\n\nMàu: ${selected.name}\nMáy ảnh: Luma Field\nỐng kính: 28 mm f/2.8\nCảm biến: APS-C 24 MP\nTrọng lượng: 320 g\nPhụ kiện: Dây đeo, pin, cáp USB-C\nGiá ý tưởng: 12.900.000 đ\n\nĐây là sản phẩm ý tưởng trong bản demo landing page. Không phát sinh đơn hàng hoặc thanh toán.\n`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "luma-field-bo-may-cua-ban.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  };

  return (
    <section id="cta" className="cta-section" aria-labelledby="cta-title">
      <div className="section-container cta-layout">
        <div className="cta-visual">
          <p className="eyebrow">Một người bạn đồng hành mới.</p>
          <div className="cta-circle" aria-hidden="true" />
          <img
            src={`${import.meta.env.BASE_URL}landings/luma/images/luma-camera.png`}
            alt={`Bản phối màu minh họa ${selected.name} của máy ảnh Luma Field`}
            width="1536"
            height="1024"
            loading="lazy"
            style={{ filter: selected.filter }}
          />
          <span className="cta-image-label">Field, theo cách của bạn.</span>
        </div>
        <div className="cta-copy">
          <p className="eyebrow">Luma Field / Adventure compact</p>
          <h2 id="cta-title">
            Chuyến đi tiếp theo,
            <br />
            mang Field theo.
          </h2>
          <p className="cta-description">
            Máy ảnh, dây đeo và một khởi đầu mới.
            <br />
            Phần còn lại, để thế giới dẫn đường.
          </p>
          <fieldset className="color-picker">
            <legend>
              Màu máy: <strong>{selected.name}</strong>
            </legend>
            <div className="swatches">
              {colors.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  className={`swatch ${color === index ? "selected" : ""}`}
                  style={{ backgroundColor: item.value }}
                  aria-label={item.name}
                  aria-pressed={color === index}
                  onClick={() => {
                    setColor(index);
                    setSaved(false);
                  }}
                >
                  {color === index && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="price-line">
            <span>
              12.900.000 <small>đ</small>
            </span>
            <span>Giá sản phẩm ý tưởng</span>
          </div>
          <button
            className="button button-dark configure-button"
            onClick={() => {
              setSaved(false);
              dialog.current?.showModal();
            }}
          >
            Chọn bộ máy của bạn <Icon name="arrow" size={19} />
          </button>
          <p className="kit-note">
            <Icon name="check" size={15} /> Trọn bộ máy, dây đeo, pin và cáp
            USB-C
          </p>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="kit-dialog"
        aria-labelledby="kit-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label="Đóng tùy chọn bộ máy"
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
          <Icon name="aperture" size={32} />
          <p className="eyebrow">Sẵn sàng cho một hành trình mới.</p>
          <h2 id="kit-dialog-title">Bộ Field của bạn.</h2>
          <dl className="kit-summary">
            <div>
              <dt>Màu máy</dt>
              <dd>{selected.name}</dd>
            </div>
            <div>
              <dt>Ống kính</dt>
              <dd>28 mm f/2.8</dd>
            </div>
            <div>
              <dt>Trong hộp</dt>
              <dd>Máy, dây đeo, pin, cáp USB-C</dd>
            </div>
            <div>
              <dt>Giá ý tưởng</dt>
              <dd>12.900.000 đ</dd>
            </div>
          </dl>
          <p className="demo-note">
            Đây là sản phẩm ý tưởng. Bạn có thể tải cấu hình để lưu lại; không
            phát sinh đơn hàng hay thanh toán.
          </p>
          <button
            className="button button-dark"
            onClick={downloadConfiguration}
          >
            Tải cấu hình bộ máy <Icon name="download" size={18} />
          </button>
          <p className="save-status" role="status">
            {saved
              ? "Đã tạo tệp cấu hình. Hãy kiểm tra mục tải xuống của bạn."
              : ""}
          </p>
        </div>
      </dialog>
    </section>
  );
}
