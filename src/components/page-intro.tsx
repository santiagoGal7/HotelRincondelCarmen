import { useEffect } from 'react'

export function PageIntro({ index, title, lede }: { index: string; title: string; lede: string }) {
  return (
    <header className="mx-auto w-full max-w-[1240px] px-5 pt-28 pb-10 sm:px-8 sm:pt-36">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{index}</p>
      <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-tight text-balance sm:text-7xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{lede}</p>
    </header>
  )
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title =
      title === 'Inicio' ? 'Hotel El Rincón del Carmen' : `${title} · El Rincón del Carmen`
  }, [title])
}
