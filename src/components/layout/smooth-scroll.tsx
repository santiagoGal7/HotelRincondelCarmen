import Lenis from 'lenis'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let detach = () => {}
    let lenis: Lenis | null = null
    let alive = true
    void import('@/lib/scroll').then(({ attachLenis }) => {
      if (!alive) return
      lenis = new Lenis({
        autoRaf: false,
        anchors: true,
        duration: 1.05,
        respectReducedMotion: true,
        prevent: (node) => Boolean(node.closest('[data-lenis-prevent]')),
      })
      detach = attachLenis(lenis)
    })
    return () => {
      alive = false
      detach()
      lenis?.destroy()
    }
  }, [])
  return null
}
