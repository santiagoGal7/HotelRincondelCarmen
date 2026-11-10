import { formatCop } from '@/lib/format'

type PriceSummaryProps = {
  roomName: string
  nights: number
  rate: number
  guests: number
}

export function PriceSummary({ roomName, nights, rate, guests }: PriceSummaryProps) {
  const total = nights * rate
  return (
    <section aria-label="Resumen de precio" className="grid gap-4">
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Tarifa</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">{roomName}</h2>
      </div>
      <dl className="grid gap-3 border-y border-line py-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Noches</dt>
          <dd>{nights}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Tarifa por noche</dt>
          <dd className="font-mono">{formatCop(rate)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Huéspedes</dt>
          <dd>{guests}</dd>
        </div>
        <div className="flex justify-between gap-4 text-base">
          <dt>Total</dt>
          <dd className="font-mono" data-testid="total">
            {formatCop(total)}
          </dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-muted">
        {nights} {nights === 1 ? 'noche' : 'noches'} × {formatCop(rate)}. No incluye cobro en línea.
      </p>
    </section>
  )
}
