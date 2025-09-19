export type StoryBeat = {
  id: string
  heading: string
  copy: string
}

export const storyBeats: StoryBeat[] = [
  {
    id: 'catalyst',
    heading: 'Spark curiosity with a cinematic intro',
    copy:
      'Use layered backdrops and motion blur to introduce the product world. Keep the hero lightweight by precomputing gradients and avoiding large image payloads.',
  },
  {
    id: 'layers',
    heading: 'Reveal layered depth as users explore',
    copy:
      'Guide the eye using scroll-based timelines. Tie copy to motion cues that animate on the same beat to maintain flow and comprehension.',
  },
  {
    id: 'orchestration',
    heading: 'Orchestrate sequences with reusable hooks',
    copy:
      'Abstract shared easing and timing curves so that every section feels cohesive. Lean on Framer Motion variants to coordinate entrances.',
  },
  {
    id: 'resolution',
    heading: 'End with a decisive invitation',
    copy:
      'Anchor the experience in a call to action that reuses earlier visual motifs—closing the loop on the narrative arc.',
  },
]
