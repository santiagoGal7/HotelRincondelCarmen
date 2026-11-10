import { useEffect, useRef } from 'react'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = dot.current
    if (!node) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    node.hidden = false
    let x = 0
    let y = 0
    let cx = 0
    let cy = 0
    let frame = 0
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={dot}
      hidden
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[65] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent mix-blend-difference min-[1024px]:block"
    />
  )
}
