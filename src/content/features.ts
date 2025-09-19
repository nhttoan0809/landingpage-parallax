export type FeatureHighlight = {
  id: string
  title: string
  description: string
  metric: string
}

export const features: FeatureHighlight[] = [
  {
    id: 'scroll-control',
    title: 'Scroll choreography',
    description:
      'Pair Lenis-driven smoothness with Framer Motion sequences. Create master timelines that coordinate content as the user advances.',
    metric: '1 master timeline',
  },
  {
    id: 'parallax',
    title: 'Layered parallax sets',
    description:
      'Compose depth using translateZ, perspective helpers, and staggered transforms to immerse visitors without expensive 3D engines.',
    metric: '5 layered planes',
  },
  {
    id: 'performance',
    title: 'Performance mindfulness',
    description:
      'Lazy-load heavy assets, throttle observers, and rely on transform/opacity animation primitives to stay above 60fps.',
    metric: '< 60ms main-thread',
  },
]
