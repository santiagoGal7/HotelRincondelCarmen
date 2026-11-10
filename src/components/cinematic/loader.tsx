import { useEffect, useState } from 'react'

export function IntroLoader() {
  const [on, setOn] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const timer = window.setTimeout(() => setOn(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  if (!on) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent"
      style={{ animation: 'rule-in 0.9s ease both' }}
    />
  )
}
