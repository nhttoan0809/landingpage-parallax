import { render, screen } from "@testing-library/react";
import Catalog from "../Catalog";
import { landingPages } from "../../landings/registry";

describe("Landing page catalog", () => {
  it("links every published design to its own document with a base-aware URL", () => {
    render(<Catalog />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Mỗi ý tưởng",
    );
    for (const landing of landingPages) {
      const heading = screen.getByRole("heading", { name: landing.name });
      const link = heading.closest("a");
      expect(link).toHaveAttribute(
        "href",
        `${import.meta.env.BASE_URL}${landing.slug}/`,
      );
      // Cross-page navigation must create a new document, never an SPA route.
      expect(link).not.toHaveAttribute("target");
      expect(screen.getByAltText(landing.previewAlt)).toHaveAttribute(
        "src",
        `${import.meta.env.BASE_URL}${landing.preview}`,
      );
    }
    expect(screen.getByText(`${landingPages.length} mẫu`)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /đi xa hơn.*giữ lại nhiều hơn/i }),
    ).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("lenis");
  });
});
