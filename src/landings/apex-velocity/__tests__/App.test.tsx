import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import Header from "../Header";
import { configuration, downloadConfiguration, variants } from "../variants";
vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@gsap/react", () => ({ useGSAP: vi.fn() }));
vi.mock("../HelmetViewer", () => ({
  default: ({
    variant,
    label,
  }: {
    variant: { name: string };
    label: string;
  }) => (
    <div role="group" aria-label={label}>
      {variant.name} model
    </div>
  ),
}));
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
    this.querySelector("button")?.focus();
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => vi.restoreAllMocks());
describe("Apex Velocity", () => {
  it("keeps all navigation, narrative and selection usable without a GPU", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "CHASE THE EDGE.",
    );
    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#"))
        expect(document.getElementById(href.slice(1))).not.toBeNull();
    }
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(
      screen.getByText(/A fictional driver and helmet collection/),
    ).toBeInTheDocument();
  });
  it("changes every viewer and the configuration summary when selecting editions", async () => {
    const user = userEvent.setup();
    render(<App />);
    const afterhours = screen.getByRole("button", {
      name: /AV–02.*Afterhours/i,
    });
    await user.click(afterhours);
    expect(afterhours).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { level: 2, name: "Afterhours" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Afterhours model")).toHaveLength(3);
    expect(
      screen.getByText("Exposed carbon-inspired composite"),
    ).toBeInTheDocument();
    const saltline = screen.getByRole("button", { name: /AV–03.*Saltline/i });
    await user.click(saltline);
    expect(afterhours).toHaveAttribute("aria-pressed", "false");
    expect(saltline).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { level: 2, name: "Saltline" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Saltline model")).toHaveLength(3);
  });
  it("exports the chosen edition with versioned colors and materials, and revokes the URL", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /AV–03.*Saltline/i }));
    const create = vi.fn<(blob: Blob) => string>(() => "blob:apex-test"),
      revoke = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      value: create,
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: revoke,
      configurable: true,
    });
    let filename = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      filename = this.download;
    });
    await user.click(
      screen.getByRole("button", { name: /Download your configuration/ }),
    );
    expect(filename).toBe("apex-velocity-saltline.json");
    const blob = create.mock.calls[0][0] as Blob;
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blob);
    });
    expect(JSON.parse(text)).toMatchObject({
      schemaVersion: "1.0",
      brand: "Apex Velocity",
      variant: { id: "saltline", name: "Saltline" },
      colors: { shell: "#e8e4d8", graphic: "#287275" },
      materials: { finish: "Pearl enamel" },
      conceptOnly: true,
    });
    expect(
      screen.getByText("Saltline configuration downloaded."),
    ).toBeInTheDocument();
    vi.useFakeTimers();
    downloadConfiguration(variants[1]);
    vi.advanceTimersByTime(1000);
    expect(revoke).toHaveBeenCalledWith("blob:apex-test");
    vi.useRealTimers();
  });
  it("produces distinct configuration data for all three materials", () => {
    const outputs = variants.map(configuration);
    expect(new Set(outputs.map((item) => item.colors.shell)).size).toBe(3);
    expect(outputs.map((item) => item.variant.id)).toEqual([
      "ignition",
      "afterhours",
      "saltline",
    ]);
    expect(outputs[1].materials.finish).toBe("Satin graphite");
  });
  it("opens the menu from the keyboard, closes with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Close/ })).toHaveFocus();
    await user.tab({ shift: true });
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" })
        .lastElementChild,
    ).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /Close/ })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("closes the menu when navigating to a section", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Header />
        <section id="collection" tabIndex={-1}>
          Helmets
        </section>
      </>,
    );
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    await user.click(trigger);
    await user.click(
      screen.getAllByRole("link", { name: /The helmets/ }).at(-1)!,
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
