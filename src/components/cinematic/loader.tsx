import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function IntroLoader() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(() => {
    if (typeof sessionStorage === 'undefined') return false
    return sessionStorage.getItem('rdc.intro') !== '1'
  })

  useEffect(() => {
    if (!visible || reduce) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('rdc.intro', '1')
      setVisible(false)
    }, 1700)
    return () => window.clearTimeout(timer)
  }, [reduce, visible])

  if (reduce || !visible) return null

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg text-fg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <motion.span
              className="mx-auto block h-2 w-2 bg-accent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.p
              className="mt-6 font-display text-4xl tracking-tight sm:text-6xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              El Rincón del Carmen
            </motion.p>
            <motion.p
              className="mt-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              Carmen de Apicalá
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
