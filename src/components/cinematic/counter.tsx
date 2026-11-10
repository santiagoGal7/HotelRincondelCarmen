import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

export function Counter({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1400, bounce: 0 })
  const text = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    motionValue.set(reduce ? value : 0)
    if (!reduce) motionValue.set(value)
  }, [inView, motionValue, value])

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
    </span>
  )
}
