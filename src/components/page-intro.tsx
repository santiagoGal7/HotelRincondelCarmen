import { useEffect } from 'react'
import { SplitText } from '@/components/cinematic/split-text'

export function PageIntro({ index, title, lede }: { index: string; title: string; lede: string }) {
  return (
    <header className="shell pt-28 pb-12 sm:pt-36 sm:pb-16">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{index}</p>
      <SplitText
        as="h1"
        text={title}
        className="mt-3 max-w-4xl font-display text-5xl leading-[0.95] font-medium tracking-tight text-balance sm:text-7xl"
      />
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
