import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function attachLenis(lenis: Lenis) {
  const unsubscribe = lenis.on('scroll', () => ScrollTrigger.update())
  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    unsubscribe()
    gsap.ticker.remove(tick)
  }
}
