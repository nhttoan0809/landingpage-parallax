import { motion, useScroll } from 'framer-motion'
import { useLenis } from '../lib/lenis'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const { prefersReducedMotion } = useLenis()

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-highlight"
      style={prefersReducedMotion ? undefined : { scaleX: scrollYProgress }}
      aria-hidden
    />
  )
}

export default ScrollProgress
