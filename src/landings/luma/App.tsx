import { MotionConfig } from "framer-motion";
import { Helmet } from "react-helmet-async";
import HeroSection from "./sections/Hero";
import StorySection from "./sections/Story";
import FeaturesSection from "./sections/Features";
import GallerySection from "./sections/Gallery";
import CTASection from "./sections/CTA";
import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import { Icon } from "./components/Icon";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Helmet>
        <title>Luma Field — Đi xa hơn. Giữ lại nhiều hơn.</title>
        <meta
          name="description"
          content="Luma Field — máy ảnh du lịch ý tưởng dành cho những bước chân tự do. Khám phá thiết kế nhỏ gọn, chất màu thiên nhiên và một góc nhìn mới."
        />
      </Helmet>
      <a href="#main-content" className="skip-link">
        Chuyển đến nội dung
      </a>
      <ScrollProgress />
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <StorySection />
        <FeaturesSection />
        <GallerySection />
        <CTASection />
      </main>
      <footer className="site-footer section-container">
        <div className="footer-top">
          <a
            href="#hero"
            className="wordmark"
            aria-label="Luma Field — về đầu trang"
          >
            <Icon name="aperture" size={27} />
            <span>
              luma<span className="wordmark-dot">®</span>
            </span>
          </a>
          <p>Đi để thấy. Chụp để nhớ.</p>
          <a href="#hero" className="back-top">
            Về đầu trang{" "}
            <Icon name="arrow" size={18} style={{ rotate: "-90deg" }} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Luma Field. Một ý tưởng cho những
            chuyến đi.
          </p>
          <p>Sản phẩm và thông số là hư cấu. Ảnh thiên nhiên: Unsplash.</p>
          <a href={import.meta.env.BASE_URL}>Tất cả landing page</a>
        </div>
      </footer>
    </MotionConfig>
  );
}
export default App;
