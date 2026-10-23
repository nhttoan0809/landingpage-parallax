export const cases = [
  {
    id: "sonora",
    name: "Sonora",
    category: "Culture & sound",
    line: "Making silence worth listening to.",
    image: "sonora.svg",
    color: "#c8b7ec",
    problem:
      "A fictional listening archive needed to make field recordings feel as intimate online as they do through a pair of headphones. A long catalogue of waveforms left the people and places behind the recordings unheard.",
    solution:
      "We imagined a spatial sound atlas: a landscape of quiet signals, each opening into an oral history, a place and a recording. A patient visual rhythm gives the listener permission to slow down. Captions and transcripts make every story available without sound.",
    outcome:
      "The concept prototype connects twelve imagined soundscapes through one accessible browsing system. In our illustrative scenario, a visitor can move from a location to its complete transcript in two actions. These are design targets, not measured client results.",
    detail: "Identity, digital experience, sound direction",
    result: "12 imagined soundscapes. One shared language.",
  },
  {
    id: "vela",
    name: "Vela Observatory",
    category: "Science & discovery",
    line: "Bringing distant worlds a little closer.",
    image: "vela.svg",
    color: "#a6d8e8",
    problem:
      "An imaginary public observatory wanted to welcome first-time stargazers. Scientific charts explained where to look, but did little to convey why a moment under the night sky could stay with you.",
    solution:
      "We designed a night field guide that begins with the naked eye. Visitors follow three visible constellations, reveal the stories behind them and choose a first observation. A low-light palette and a complete text guide keep the experience useful outdoors.",
    outcome:
      "The concept brings three fictional exhibition routes into a single responsive field guide. Its illustrative success criterion is a complete first-observation plan in under three minutes. No live observatory or research study is represented.",
    detail: "Experience strategy, art direction, interactive design",
    result: "A first step into a much larger universe.",
  },
  {
    id: "verdant",
    name: "Verdant Futures",
    category: "Ecology & possibility",
    line: "A living picture of what comes next.",
    image: "verdant.svg",
    color: "#c7d9b5",
    problem:
      "A fictional urban rewilding initiative needed a way to make long-term change tangible. Its proposed habitats were compelling on paper, but difficult for residents to picture in their own neighbourhood.",
    solution:
      "We imagined an evolving digital garden. A visitor follows rain, soil and shade through a small city block, seeing how a pocket habitat grows over seasons. Plain-language annotations connect each visual change with an action a community could take.",
    outcome:
      "This concept translates four imagined seasonal states into an accessible visual story. The illustrative outcome is a clear planting and maintenance plan for one pocket garden. Environmental benefits are hypothetical; no real impact data is claimed.",
    detail: "Narrative design, visual identity, creative development",
    result: "Four seasons. A future you can picture.",
  },
] as const;
export type CaseStudy = (typeof cases)[number];
