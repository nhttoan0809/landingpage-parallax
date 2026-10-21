export type GalleryItem = {
  id: string
  title: string
  description: string
  accent: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'nebula-interface',
    title: 'Nebula interface',
    description: 'Layered nebula renders react to scroll depth with hue shifts and parallax drifts.',
    accent: 'from-primary/40 to-accent/30',
  },
  {
    id: 'gravity-wells',
    title: 'Gravity wells',
    description: 'Orbiting cards accelerate with scroll-controlled easing to visualize gravitational pull.',
    accent: 'from-accent/30 to-highlight/20',
  },
  {
    id: 'signal-streams',
    title: 'Signal streams',
    description: 'Ambient particle trails reveal new sections while respecting reduced-motion preferences.',
    accent: 'from-primary/30 to-white/20',
  },
]
