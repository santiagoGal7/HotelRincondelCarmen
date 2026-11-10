import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatCop } from '@/lib/format'
import { useHotel } from '@/lib/hotel-context'

export function StickyBook() {
  const { pathname } = useLocation()
  const { rooms } = useHotel()
  const [visible, setVisible] = useState(false)
  const hidden =
    pathname.startsWith('/reservar') || pathname.startsWith('/entrar') || pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const from = rooms.reduce<number | null>((min, room) => {
    if (min === null || room.precioNoche < min) return room.precioNoche
    return min
  }, null)

  return (
    <AnimatePresence>
      {visible && !hidden && from !== null ? (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur-md"
        >
          <div className="shell flex items-center justify-between gap-4 py-3">
            <p className="text-sm">
              <span className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Desde</span>
              <span className="font-display text-2xl">{formatCop(from)}</span>
              <span className="text-muted"> / noche</span>
            </p>
            <Button asChild variant="primary" size="sm" arrow magnetic>
              <Link to="/reservar">Reservar</Link>
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
