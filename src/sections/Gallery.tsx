import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { galleryItems } from '../content/gallery'

function GallerySection() {
  const containerRef = useRef<HTMLElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start center', 'end end'] })
  const translateX = useMotionValue(0)
  const rotate = useTransform(scrollYProgress, [0, 1], ['0deg', '-6deg'])
  const [maxTranslate, setMaxTranslate] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const list = listRef.current
    if (!container || !list) return

    const updateBounds = () => {
      const widthDelta = Math.max(0, list.scrollWidth - container.clientWidth)
      setMaxTranslate(widthDelta)
    }

    updateBounds()

    const resizeObserver = new ResizeObserver(updateBounds)
    resizeObserver.observe(container)
    resizeObserver.observe(list)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!maxTranslate) {
      translateX.set(0)
      return
    }

    const unsubscribe = scrollYProgress.on('change', (value) => {
      translateX.set(-value * maxTranslate)
    })

    return () => {
      unsubscribe()
    }
  }, [maxTranslate, scrollYProgress, translateX])

  return (
    <section id="gallery" ref={containerRef} className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(27,231,255,0.1),transparent_70%)]" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-accent/70">Gallery sequence</p>
          <h2 className="mt-6 font-display text-4xl leading-snug sm:text-5xl">
            Scroll to slide sideways through the concept gallery.
          </h2>
          <p className="mt-6 text-lg text-white/70">
            The gallery emulates horizontal motion controlled by the vertical scroll position for a delightful reveal.
          </p>
        </div>
        <div className="relative h-[360px] overflow-hidden">
          <motion.ul
            ref={listRef}
            className="flex h-full w-max items-center gap-10 px-2 sm:px-6"
            style={{ x: translateX, rotate }}
          >
            {galleryItems.map((item, index) => (
              <motion.li
                key={item.id}
                className="w-[320px] shrink-0 rounded-3xl border border-white/10 bg-background/80 p-6 backdrop-blur"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
              >
                <div
                  className={`mb-4 h-40 rounded-2xl bg-gradient-to-br ${item.accent}`}
                  role="presentation"
                />
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70">{item.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

export default GallerySection
