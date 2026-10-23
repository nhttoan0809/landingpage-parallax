import {
  render,
  screen,
  within,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import App from "../App";
import Customizer from "../Customizer";
import { defaultPreset, storageKey } from "../preset";

vi.mock("../SceneView", () => ({
  default: () => <div data-testid="scene-mock" />,
}));
afterEach(cleanup);

describe("accessible story and case studies", () => {
  it("reads every chapter and the full case stories with reduced motion", async () => {
    render(<App />);
    await screen.findByTestId("scene-mock");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Some ideas",
    );
    for (const id of [
      "spark",
      "formation",
      "resonance",
      "rebirth",
      "reimagine",
    ])
      expect(document.getElementById(id)).toBeInTheDocument();
    expect(document.querySelector("[data-static]")).toHaveAttribute(
      "data-static",
      "true",
    );
    expect(document.querySelector("canvas")).toBeNull();
    expect(screen.getAllByText("Imagined outcome")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Sound off" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.getByRole("link", { name: /Return to collection/ }),
    ).toHaveAttribute("href", import.meta.env.BASE_URL);
  });
  it("opens by Enter, traps keyboard focus, closes by Escape and restores the trigger", async () => {
    const user = userEvent.setup();
    render(<App />);
    const trigger = screen.getByRole("button", {
      name: "Explore Sonora case study",
    });
    trigger.focus();
    await user.keyboard("{Enter}");
    const dialog = screen.getByRole("dialog", { name: "Sonora" });
    expect(within(dialog).getByText(/Fictional project/)).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Close case study" }),
    ).toHaveFocus();
    await user.tab();
    expect(
      within(dialog).getByRole("button", { name: "Close case study" }),
    ).toHaveFocus();
    await user.tab({ shift: true });
    expect(
      within(dialog).getByRole("button", { name: "Close case study" }),
    ).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});
function MaterialHarness() {
  const [preset, setPreset] = useState({ ...defaultPreset });
  return (
    <Customizer
      preset={preset}
      onChange={setPreset}
      quality="auto"
      onQuality={() => {}}
    />
  );
}
describe("material controls", () => {
  it("saves, changes and restores a device preset, then resets", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<MaterialHarness />);
    await user.click(screen.getByRole("radio", { name: "Tide" }));
    await user.click(screen.getByRole("button", { name: /Save preset/ }));
    expect(JSON.parse(localStorage.getItem(storageKey)!).palette).toBe("tide");
    await user.click(screen.getByRole("radio", { name: "Ember" }));
    await user.click(screen.getByRole("button", { name: "Restore saved" }));
    expect(screen.getByRole("radio", { name: "Tide" })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "Opal" })).toBeChecked();
  });
  it("reports a corrupt saved preset without changing material state", async () => {
    const user = userEvent.setup();
    localStorage.setItem(storageKey, "{bad");
    render(<MaterialHarness />);
    await user.click(screen.getByRole("button", { name: "Restore saved" }));
    expect(screen.getByRole("alert")).toHaveTextContent("not valid JSON");
    expect(screen.getByRole("radio", { name: "Opal" })).toBeChecked();
  });
});
