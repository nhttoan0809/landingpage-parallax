/// <reference types="vitest" />
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { LenisProvider } from "../lib/lenis";
import App from "../App";

const renderApp = () =>
  render(
    <HelmetProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </HelmetProvider>,
  );

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

describe("Luma Field experience", () => {
  it("provides a complete product narrative with valid in-page navigation", () => {
    renderApp();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /đi xa hơn.*giữ lại nhiều hơn/i,
      }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link")) {
      const target = link.getAttribute("href");
      if (target?.startsWith("#"))
        expect(document.getElementById(target.slice(1))).not.toBeNull();
    }
    expect(
      screen.getByText(/sản phẩm và thông số là hư cấu/i),
    ).toBeInTheDocument();
  });

  it("changes the landscape using accessible keyboard tabs", async () => {
    const user = userEvent.setup();
    renderApp();
    const mountain = screen.getByRole("tab", { name: "Sương núi" });
    await user.click(mountain);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Nắng rừng" })).toHaveFocus();
    expect(
      screen.getByRole("tabpanel", { name: "Nắng rừng" }),
    ).toHaveTextContent("Lạc một chút.");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Biển sớm" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowRight}");
    expect(mountain).toHaveFocus();
  });

  it("carries the selected camera color into the kit dialog", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Đá núi" }));
    expect(screen.getByRole("button", { name: "Đá núi" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(
      screen.getByRole("button", { name: "Chọn bộ máy của bạn" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Bộ Field của bạn." });
    expect(within(dialog).getByText("Đá núi")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/không phát sinh đơn hàng/i),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Đóng tùy chọn bộ máy" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes mobile navigation after choosing a destination", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: "Mở menu" }));
    const nav = screen.getByRole("navigation", { name: "Điều hướng di động" });
    await user.click(within(nav).getByRole("link", { name: "Thiết kế" }));
    expect(
      screen.queryByRole("navigation", { name: "Điều hướng di động" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mở menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps parallax static when reduced motion is enabled", () => {
    const { container } = renderApp();
    expect(document.body.dataset.reducedMotion).toBe("true");
    const camera = container.querySelector<HTMLElement>(
      '[data-parallax="camera"]',
    );
    const landscape = container.querySelector<HTMLElement>(
      '[data-parallax="landscape"]',
    );
    expect(camera?.style.transform).not.toMatch(/translate/);
    expect(landscape?.style.transform).toBe("none");
    expect(container.querySelector(".scroll-progress")).toBeNull();
  });
});
