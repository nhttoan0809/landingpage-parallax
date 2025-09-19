import { motion, useScroll, useTransform, type TargetAndTransition } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { useLenis } from '../lib/lenis'

const floatingVariants = {
  initial: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { prefersReducedMotion } = useLenis()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })

  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const backdropOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])
  const glyphRotation = useTransform(scrollYProgress, [0, 1], ['0deg', '10deg'])

  const floatAnimation = useMemo<TargetAndTransition | undefined>(
    () =>
      prefersReducedMotion
        ? undefined
        : {
            y: ['-40%', '40%'],
            transition: {
              duration: 24,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror' as const,
            },
          },
    [prefersReducedMotion],
  )

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-32 pt-40 sm:px-12 lg:px-20"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ scale: backdropScale, opacity: backdropOpacity }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.35),transparent_65%)]" />
        <motion.div
          className="absolute -right-32 top-24 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl"
          style={{ rotate: glyphRotation }}
        />
        <motion.div
          className="absolute -left-32 bottom-12 h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl"
          animate={floatAnimation}
        />
      </motion.div>

      <motion.span
        className="text-sm uppercase tracking-[0.5em] text-accent/70"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      >
        Parallax Odyssey
      </motion.span>

      <motion.h1
        className="mt-6 max-w-4xl font-display text-5xl leading-tight sm:text-6xl"
        style={{ y: headlineY }}
        initial="initial"
        animate="enter"
        variants={floatingVariants}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        Craft a scroll-driven tale that feels alive, responsive, and effortless.
      </motion.h1>

      <motion.p
        className="mt-6 max-w-2xl text-lg text-white/70"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
      >
        This playground demonstrates smooth Lenis-powered scrolling combined with Framer Motion timelines to tell a
        cohesive story. Each section reveals another layer of the experience while keeping performance in check.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
      >
        <a
          className="rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow"
          href="#story"
        >
          Start the journey
        </a>
        <a
          className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
          href="#features"
        >
          Explore features
        </a>
      </motion.div>

      <motion.ul
        className="mt-16 grid gap-4 text-sm text-white/60 sm:grid-cols-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
      >
        <li className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur">
          Lenis smooth scrolling with reduced-motion awareness.
        </li>
        <li className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur">
          Framer Motion variants orchestrate scroll-triggered scenes.
        </li>
        <li className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur">
          Tailwind-powered layout for fast iteration and consistency.
        </li>
      </motion.ul>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: 'easeOut' }}
      >
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/50">
          Scroll
          <motion.span
            className="inline-block h-12 w-px bg-white/30"
            animate={prefersReducedMotion ? undefined : { scaleY: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}

export default HeroSection
