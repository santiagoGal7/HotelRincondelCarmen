import { useEffect } from 'react'
import { SplitText } from '@/components/cinematic/split-text'

export function PageIntro({ index, title, lede }: { index: string; title: string; lede: string }) {
  return (
    <header className="shell pt-28 pb-12 sm:pt-36 sm:pb-16">
      <p className="type-kicker text-muted">{index}</p>
      <div className="rule mt-4 max-w-xs" />
      <SplitText
        as="h1"
        text={title}
        className="type-h1 mt-4 max-w-4xl text-balance"
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
