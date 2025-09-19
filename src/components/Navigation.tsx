import clsx from 'clsx'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLenis } from '../lib/lenis'

const links = [
  { id: 'hero', label: 'Intro' },
  { id: 'story', label: 'Story' },
  { id: 'features', label: 'Features' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'cta', label: 'Join' },
]

function Navigation() {
  const { lenis } = useLenis()
  const [activeId, setActiveId] = useState('hero')
  const activeIdRef = useRef(activeId)

  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  useEffect(() => {
    const sectionNodes = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    if (!sectionNodes.length) return

    const visibilityMap = new Map<string, number>()
    const thresholds = Array.from({ length: 21 }, (_, index) => index / 20)

    const setNextActive = (nextId: string) => {
      setActiveId((previous) => {
        if (previous === nextId) return previous
        activeIdRef.current = nextId
        return nextId
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id

          if (entry.isIntersecting) {
            visibilityMap.set(sectionId, entry.intersectionRatio)
          } else {
            visibilityMap.delete(sectionId)
          }
        })

        if (!visibilityMap.size) return

        const [nextId, ratio] = Array.from(visibilityMap.entries()).sort((a, b) => b[1] - a[1])[0]

        if (ratio >= 0.5) {
          setNextActive(nextId)
          return
        }

        if (!visibilityMap.has(activeIdRef.current)) {
          setNextActive(nextId)
        }
      },
      {
        rootMargin: '-25% 0px -25% 0px',
        threshold: thresholds,
      },
    )

    sectionNodes.forEach((node) => observer.observe(node))

    return () => {
      sectionNodes.forEach((node) => observer.unobserve(node))
      observer.disconnect()
    }
  }, [])

  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return

    if (lenis) {
      lenis.scrollTo(target, {
        offset: id === 'hero' ? -120 : -40,
        duration: 1.1,
      })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="fixed inset-x-0 top-6 z-50 flex justify-center">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface/80 px-4 py-2 backdrop-blur-xl">
        {links.map(({ id, label }) => (
          <button
            key={id}
            className={clsx(
              'group relative text-sm font-semibold uppercase tracking-[0.2em] transition-colors',
              activeId === id ? 'text-white' : 'text-white/60',
            )}
            onClick={(event) => handleClick(event, id)}
          >
            {label}
            <span
              className={clsx(
                'pointer-events-none absolute inset-x-0 bottom-[-4px] mx-auto h-0.5 w-6 rounded-full bg-accent transition-opacity duration-300',
                activeId === id ? 'opacity-100' : 'opacity-0',
              )}
            />
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
