import { motion } from 'framer-motion'

function CTASection() {
  return (
    <section id="cta" className="relative px-6 py-32 sm:px-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-primary/30 via-background/60 to-background p-12 text-center shadow-glow backdrop-blur">
        <motion.h2
          className="font-display text-4xl leading-snug sm:text-5xl"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Ready to experiment with scroll magic?
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          Clone the project, iterate on the scenes, and tune the storytelling beats to highlight your strengths.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/"
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow"
          >
            View Source
          </a>
          <a
            href="#hero"
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
          >
            Back to top
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
