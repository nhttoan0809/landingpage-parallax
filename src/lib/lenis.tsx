import Lenis from '@studio-freight/lenis'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type LenisContextValue = {
  lenis: Lenis | null
  prefersReducedMotion: boolean
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  prefersReducedMotion: false,
})
// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext)

export function LenisProvider({ children }: PropsWithChildren) {
  const initialReducedMotion =
    typeof window !== 'undefined' ? window.matchMedia(REDUCED_MOTION_QUERY).matches : false
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(initialReducedMotion)
  const rafRef = useRef<number | undefined>(undefined)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Safari < 14 fallback
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.body.dataset.reducedMotion = prefersReducedMotion ? 'true' : 'false'
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      setLenis(null)
      return
    }

    const instance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    })

    const animate = (time: number) => {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    lenisRef.current = instance
    setLenis(instance)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [prefersReducedMotion])

  const value = useMemo(
    () => ({
      lenis,
      prefersReducedMotion,
    }),
    [lenis, prefersReducedMotion],
  )

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
