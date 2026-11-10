import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

export function SplitText({
  text,
  className,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  as?: 'span' | 'h1' | 'h2'
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <Tag className={className}>{text}</Tag>
  return (
    <Tag className={cn(className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.85, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Tag>
  )
}
