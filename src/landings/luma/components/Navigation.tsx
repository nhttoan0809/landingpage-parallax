import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

const links = [
  { id: "story", label: "Câu chuyện" },
  { id: "features", label: "Thiết kế" },
  { id: "gallery", label: "Góc nhìn" },
];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: [0, 0.2, 0.5] },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#hero"
        aria-label="Luma Field — về đầu trang"
        onClick={() => setMenuOpen(false)}
      >
        <Icon name="aperture" size={27} />
        <span>
          luma<span className="wordmark-dot">®</span>
        </span>
      </a>
      <nav aria-label="Điều hướng chính" className="desktop-nav">
        {links.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a href="#cta" className="button button-dark button-small">
          Khám phá Field <Icon name="arrow" size={16} />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? "mobile-navigation" : undefined}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Điều hướng di động"
          className="mobile-nav"
        >
          {links.map(({ id, label }) => (
            <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
              {label}
              <Icon name="arrow" />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
export default Navigation;
