import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

export function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -16 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="bg-bg"
      >
        {outlet as ReactNode}
      </motion.div>
    </AnimatePresence>
  )
}
