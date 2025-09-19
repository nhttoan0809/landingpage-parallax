import { Helmet } from 'react-helmet-async'
import HeroSection from './sections/Hero'
import StorySection from './sections/Story'
import FeaturesSection from './sections/Features'
import GallerySection from './sections/Gallery'
import CTASection from './sections/CTA'
import Navigation from './components/Navigation'
import ScrollProgress from './components/ScrollProgress'

const sections = [
  { id: 'hero', component: HeroSection },
  { id: 'story', component: StorySection },
  { id: 'features', component: FeaturesSection },
  { id: 'gallery', component: GallerySection },
  { id: 'cta', component: CTASection },
]

function App() {
  return (
    <main className="relative min-h-screen bg-background text-white">
      <Helmet>
        <title>Parallax Odyssey</title>
        <meta
          name="description"
          content="Story-driven landing page with immersive scroll animations and parallax layers."
        />
      </Helmet>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.25),transparent_60%)]" />
      <ScrollProgress />
      <Navigation />
      {sections.map(({ id, component: Section }) => (
        <Section key={id} />
      ))}
    </main>
  )
}

export default App
