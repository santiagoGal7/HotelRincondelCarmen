type PhotoProps = {
  name: string
  alt: string
  className?: string
  priority?: boolean
}

export function Photo({ name, alt, className, priority = false }: PhotoProps) {
  return (
    <picture>
      <source srcSet={`/media/${name}.avif`} type="image/avif" />
      <img
        src={`/media/${name}.webp`}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
