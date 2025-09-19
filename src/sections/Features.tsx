import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { features } from '../content/features'

function FeaturesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const backgroundShift = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const borderGlow = useTransform(scrollYProgress, [0, 1], ['rgba(124,92,255,0.2)', 'rgba(27,231,255,0.25)'])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-surface py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/4 hidden w-1/2 rotate-12 bg-gradient-to-br from-primary/35 via-transparent to-transparent opacity-80 lg:block"
        style={{ translateY: backgroundShift }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 hidden h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl lg:block"
        style={{ translateY: useTransform(scrollYProgress, [0, 1], ['10%', '-14%']) }}
      />
      <div className="mx-auto flex max-w-content flex-col gap-12 px-6 sm:px-12 lg:flex-row">
        <div className="lg:w-[360px]">
          <p className="text-sm uppercase tracking-[0.4em] text-accent/70">Feature highlights</p>
          <h2 className="mt-6 font-display text-4xl leading-snug sm:text-5xl">
            Build believable depth with motion that feels purposeful.
          </h2>
          <p className="mt-6 text-lg text-white/70">
            These modules explore how to keep scroll animations intentional, accessible, and smooth across devices.
          </p>
        </div>
        <div ref={stickyRef} className="flex-1 space-y-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.id}
              className={clsx(
                'group relative overflow-hidden rounded-3xl border border-white/10 bg-background/60 p-6 backdrop-blur transition-transform duration-500',
              )}
              style={{ borderColor: borderGlow }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.08 }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <div className="absolute inset-[-1px] -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              </motion.div>
              <header className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl text-white">{feature.title}</h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                  {feature.metric}
                </span>
              </header>
              <p className="mt-4 text-base text-white/70">{feature.description}</p>
              <motion.div
                className="mt-6 h-1 w-full origin-left rounded-full bg-white/10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
