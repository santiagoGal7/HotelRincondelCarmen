import * as Dialog from '@radix-ui/react-dialog'
import { Photo } from '@/components/photo'

export function Lightbox({
  images,
  alts,
  index,
  open,
  onOpenChange,
  onIndex,
}: {
  images: string[]
  alts: string[]
  index: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onIndex: (index: number) => void
}) {
  const name = images[index]
  if (!name) return null
  const last = images.length - 1
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/88" />
        <Dialog.Content
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-10"
          data-lenis-prevent
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') onIndex(index === last ? 0 : index + 1)
            if (event.key === 'ArrowLeft') onIndex(index === 0 ? last : index - 1)
          }}
        >
          <Dialog.Title className="sr-only">Galería</Dialog.Title>
          <Dialog.Description className="sr-only">
            Fotografía {index + 1} de {images.length}
          </Dialog.Description>
          <Photo name={name} alt={alts[index] ?? ''} className="max-h-[82vh] w-auto max-w-full object-contain" />
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6 text-sm text-white">
            <button type="button" className="underline underline-offset-4" onClick={() => onIndex(index === 0 ? last : index - 1)}>
              Anterior
            </button>
            <span className="font-mono text-xs">
              {index + 1} / {images.length}
            </span>
            <button type="button" className="underline underline-offset-4" onClick={() => onIndex(index === last ? 0 : index + 1)}>
              Siguiente
            </button>
          </div>
          <Dialog.Close className="absolute top-4 right-4 text-sm text-white underline underline-offset-4">
            Cerrar
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
