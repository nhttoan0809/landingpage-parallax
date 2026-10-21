import { landingPages } from "../landings/registry";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#collection">
        Chuyển đến danh sách
      </a>
      <header className={styles.header}>
        <a href={base} className={styles.brand}>
          Landing pages
          <span className={styles.brandMark} aria-hidden="true">
            ✳
          </span>
        </a>
        <span className={styles.headerNote}>Bộ sưu tập thiết kế cá nhân</span>
      </header>
      <main>
        <div className={styles.intro}>
          <h1>
            Mỗi ý tưởng,
            <br />
            một diện mạo riêng.
          </h1>
          <p>
            Những mẫu landing page với câu chuyện, phong cách và cách chuyển
            động khác nhau. Chọn một mẫu để khám phá.
          </p>
        </div>
        <section
          id="collection"
          tabIndex={-1}
          aria-labelledby="collection-title"
          className={styles.collection}
        >
          <div className={styles.collectionHeading}>
            <h2 id="collection-title">Các landing page</h2>
            <span>{landingPages.length} mẫu</span>
          </div>
          <ul className={styles.list}>
            {landingPages.map((landing) => (
              <li key={landing.slug}>
                <a href={`${base}${landing.slug}/`} className={styles.entry}>
                  <div className={styles.preview}>
                    <img
                      src={`${base}${landing.preview}`}
                      alt={landing.previewAlt}
                      width="720"
                      height="480"
                    />
                  </div>
                  <div className={styles.details}>
                    <p className={styles.category}>{landing.category}</p>
                    <h3>{landing.name}</h3>
                    <p className={styles.description}>{landing.description}</p>
                    <ul
                      className={styles.tags}
                      aria-label="Phong cách thiết kế"
                    >
                      {landing.styles.map((style) => (
                        <li key={style}>{style}</li>
                      ))}
                    </ul>
                  </div>
                  <span className={styles.visit}>
                    Xem mẫu <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>Một bộ sưu tập đang tiếp tục mở rộng.</p>
        <p>Thiết kế để khám phá.</p>
      </footer>
    </div>
  );
}
