import { motion, useScroll, useTransform, type Transition } from 'framer-motion'
import { useRef } from 'react'
import { storyBeats } from '../content/story'

function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start center', 'end center'] })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const headingTranslate = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  const entryTransition: Transition = {
    duration: 0.7,
    ease: 'easeOut',
  }

  return (
    <section id="story" ref={sectionRef} className="mx-auto max-w-content px-6 py-32 sm:px-12">
      <div className="grid gap-16 lg:grid-cols-[320px,1fr] lg:items-start">
        <motion.div
          className="space-y-6"
          style={{ y: headingTranslate }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entryTransition}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-accent/70">Narrative Flow</p>
          <h2 className="font-display text-4xl leading-snug sm:text-5xl">
            Each scroll beat slides you deeper into the story world.
          </h2>
          <p className="text-lg text-white/70">
            Break the experience into distinct beats that align copy, motion, and interaction. Each beat should answer
            why the visitor should continue exploring.
          </p>
        </motion.div>
        <div className="relative pl-10">
          <span className="absolute left-[11px] top-0 h-full w-px bg-white/10" aria-hidden />
          <motion.span
            className="absolute left-[11px] top-0 w-px bg-gradient-to-b from-accent via-primary to-transparent"
            style={{ height: progressHeight }}
            aria-hidden
          />
          <ul className="space-y-12">
            {storyBeats.map((beat, index) => (
              <motion.li
                key={beat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ ...entryTransition, delay: index * 0.08 }}
                className="relative rounded-3xl border border-white/10 bg-background/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur"
              >
                <span className="absolute -left-[34px] top-6 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-background text-xs text-white/70">
                  {index + 1}
                </span>
                <h3 className="font-display text-2xl text-white">{beat.heading}</h3>
                <p className="mt-4 text-base text-white/70">{beat.copy}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default StorySection
