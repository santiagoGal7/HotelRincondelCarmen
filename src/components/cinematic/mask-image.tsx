import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function MaskImage({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(14% 10% 14% 10%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
