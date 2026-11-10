import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import type { ReactNode } from 'react'

export function Carousel({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  const [ref, api] = useEmblaCarousel({ align: 'start', loop: true, skipSnaps: false })
  const prev = useCallback(() => api?.scrollPrev(), [api])
  const next = useCallback(() => api?.scrollNext(), [api])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{label}</p>
        <div className="flex gap-2">
          <Button type="button" variant="icon" size="sm" onClick={prev} aria-label="Anterior">
            ←
          </Button>
          <Button type="button" variant="icon" size="sm" onClick={next} aria-label="Siguiente">
            →
          </Button>
        </div>
      </div>
      <div ref={ref} className="overflow-hidden" data-lenis-prevent>
        <div className="flex">{children}</div>
      </div>
    </div>
  )
}

export function Slide({ children }: { children: ReactNode }) {
  return <div className="min-w-0 flex-[0_0_86%] pr-3 sm:flex-[0_0_48%] lg:flex-[0_0_34%]">{children}</div>
}
