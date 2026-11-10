type PhotoProps = {
  name: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function Photo({
  name,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: PhotoProps) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`/media/${name}-800.avif 800w, /media/${name}.avif 1600w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/media/${name}-800.webp 800w, /media/${name}.webp 1600w`}
        sizes={sizes}
      />
      <img
        src={`/media/${name}.webp`}
        alt={alt}
        className={className}
        width={1600}
        height={1066}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
