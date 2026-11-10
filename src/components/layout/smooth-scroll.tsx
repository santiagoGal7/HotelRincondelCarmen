import Lenis from 'lenis'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.05,
      respectReducedMotion: true,
      prevent: (node) => Boolean(node.closest('[data-lenis-prevent]')),
    })
    return () => lenis.destroy()
  }, [])
  return null
}
