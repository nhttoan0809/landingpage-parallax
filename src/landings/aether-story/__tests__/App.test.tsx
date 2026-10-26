import {
  render,
  screen,
  within,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import App from "../App";
import Customizer from "../Customizer";
import ChapterControls from "../ChapterControls";
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
    <>
      <ChapterControls
        kind="flight"
        preset={preset}
        onChange={setPreset}
        reduced={false}
      />
      <ChapterControls
        kind="light"
        preset={preset}
        onChange={setPreset}
        reduced={false}
      />
      <Customizer
        preset={preset}
        onChange={setPreset}
        quality="auto"
        onQuality={() => {}}
      />
    </>
  );
}
describe("material controls", () => {
  it("keeps both chapter settings through save, reset and restore", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<MaterialHarness />);
    const slider = (name: string) => screen.getByRole("slider", { name });
    fireEvent.change(slider("Wingbeat speed"), { target: { value: "1.65" } });
    fireEvent.change(slider("Wing openness"), { target: { value: "0.38" } });
    fireEvent.change(slider("Iridescence"), { target: { value: "0.91" } });
    fireEvent.change(slider("Dispersion"), { target: { value: "0.22" } });
    fireEvent.change(slider("Inner glow"), { target: { value: "0.7" } });
    const wingbeats = screen.getByRole("switch", { name: /Allow wingbeats/ });
    wingbeats.focus();
    await user.keyboard(" ");
    expect(wingbeats).not.toBeChecked();
    expect(slider("Wingbeat speed")).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Save preset/ }));
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toMatchObject({
      version: 4,
      appearance: "iridescent",
      flapSpeed: 1.65,
      wingSpread: 0.38,
      flapEnabled: false,
      iridescence: 0.91,
      dispersion: 0.22,
      glow: 0.7,
    });
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(wingbeats).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Restore saved" }));
    expect(wingbeats).not.toBeChecked();
    expect(slider("Wingbeat speed")).toHaveValue("1.65");
    expect(slider("Iridescence")).toHaveValue("0.91");
    expect(screen.getByText("A quiet glide")).toBeInTheDocument();
  });
  it("disables time-based controls in reduced motion while retaining wing and light choices", () => {
    render(
      <ChapterControls
        kind="flight"
        preset={defaultPreset}
        onChange={() => {}}
        reduced
      />,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
    expect(
      screen.getByRole("slider", { name: "Wingbeat speed" }),
    ).toBeDisabled();
    expect(screen.getByRole("slider", { name: "Wing openness" })).toBeEnabled();
  });
  it("saves, changes and restores a device preset, then resets", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    render(<MaterialHarness />);
    await user.click(screen.getByRole("radio", { name: "Holo Wireframe" }));
    await user.click(screen.getByRole("button", { name: /Save preset/ }));
    expect(JSON.parse(localStorage.getItem(storageKey)!).appearance).toBe(
      "holo",
    );
    await user.click(screen.getByRole("radio", { name: "Solar Magma GLSL" }));
    await user.click(screen.getByRole("button", { name: "Restore saved" }));
    expect(screen.getByRole("radio", { name: "Holo Wireframe" })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(
      screen.getByRole("radio", { name: "Iridescent GLSL" }),
    ).toBeChecked();
  });
  it("reports a corrupt saved preset without changing material state", async () => {
    const user = userEvent.setup();
    localStorage.setItem(storageKey, "{bad");
    render(<MaterialHarness />);
    await user.click(screen.getByRole("button", { name: "Restore saved" }));
    expect(screen.getByRole("alert")).toHaveTextContent("not valid JSON");
    expect(
      screen.getByRole("radio", { name: "Iridescent GLSL" }),
    ).toBeChecked();
  });
});

it("selects appearances by keyboard, preserves them and explains nonrefractive forms", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  render(<MaterialHarness />);
  const iridescent = screen.getByRole("radio", { name: "Iridescent GLSL" });
  iridescent.focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "Holo Wireframe" })).toBeChecked();
  expect(screen.getByRole("slider", { name: "Dispersion" })).toBeDisabled();
  await user.click(screen.getByRole("radio", { name: "Solar Magma GLSL" }));
  await user.click(screen.getByRole("button", { name: /Save preset/ }));
  expect(JSON.parse(localStorage.getItem(storageKey)!).appearance).toBe(
    "magma",
  );
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(iridescent).toBeChecked();
  await user.click(screen.getByRole("button", { name: "Restore saved" }));
  expect(screen.getByRole("radio", { name: "Solar Magma GLSL" })).toBeChecked();
  expect(
    screen.getByText("Solar Magma GLSL", { selector: "strong" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("radio", { name: "Iridescent GLSL" }));
  expect(screen.getByRole("slider", { name: "Dispersion" })).toBeEnabled();
});

it("marks a story as discovered and retains its state in static reading", async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole("button", {
    name: "Explore Sonora case study",
  });
  expect(trigger).toHaveTextContent("A story waiting");
  await user.click(trigger);
  expect(trigger).toHaveTextContent("Story discovered");
  await user.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveTextContent("Revisit concept");
  expect(trigger.querySelector("img")).toHaveAttribute(
    "src",
    expect.stringContaining("sonora-crystal-awakened.webp"),
  );
  expect(
    screen.queryByRole("radio", { name: "Prismatic Glass" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("group", { name: "Choose a palette" }),
  ).not.toBeInTheDocument();
});
