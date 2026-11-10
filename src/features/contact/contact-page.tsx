import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageIntro, usePageTitle } from '@/components/page-intro'
import { Button } from '@/components/ui/button'
import { controlClass, Field } from '@/components/ui/field'
import { useHotel } from '@/lib/hotel-context'
import { contactSchema } from '@/lib/schemas'
import type { z } from 'zod'

export function ContactPage() {
  usePageTitle('Contacto')
  const { sendMessage, source } = useHotel()
  const [sent, setSent] = useState(false)
  const form = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema) })

  return (
    <>
      <PageIntro
        index="Contacto"
        title="Escribe a la casa."
        lede="Teléfono, correo y dirección del proyecto original. El mensaje se guarda en la demostración; no sale por correo."
      />
      <div className="shell grid gap-12 pb-16 lg:grid-cols-2 lg:gap-16">
        <div className="grid gap-6 text-sm">
          <div>
            <p className="text-muted">Dirección</p>
            <p className="mt-1">Carrera 10 #25-30, Carmen de Apicalá, Tolima, Colombia</p>
          </div>
          <div>
            <p className="text-muted">Teléfono</p>
            <p className="mt-1">
              <a href="tel:+571234567890">+57 123 456 7890</a>
            </p>
          </div>
          <div>
            <p className="text-muted">Correo</p>
            <p className="mt-1">
              <a href="mailto:info@rincondelcarmen.com">info@rincondelcarmen.com</a>
            </p>
          </div>
          <div>
            <p className="text-muted">Recepción</p>
            <p className="mt-1">Todos los días. Entrada 15:00, salida 12:00.</p>
          </div>
        </div>
        {sent ? (
          <p className="text-lg">
            Mensaje guardado en {source === 'http' ? 'el servidor local' : 'este navegador'}.
            Recepción lo ve en el panel.
          </p>
        ) : (
          <form
            className="grid gap-4"
            noValidate
            onSubmit={form.handleSubmit(async (values) => {
              await sendMessage(values)
              setSent(true)
            })}
          >
            <Field label="Nombre" error={form.formState.errors.nombre?.message}>
              <input className={controlClass} autoComplete="name" {...form.register('nombre')} />
            </Field>
            <Field label="Correo" error={form.formState.errors.email?.message}>
              <input
                className={controlClass}
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
            </Field>
            <Field label="Mensaje" error={form.formState.errors.mensaje?.message}>
              <textarea className={`${controlClass} min-h-36`} {...form.register('mensaje')} />
            </Field>
            <Button type="submit" variant="primary" arrow loading={form.formState.isSubmitting}>
              Enviar mensaje
            </Button>
          </form>
        )}
      </div>
      <iframe
        title="Mapa de Carmen de Apicalá"
        className="h-[420px] w-full grayscale"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-74.755%2C4.132%2C-74.715%2C4.162&layer=mapnik&marker=4.147%2C-74.735"
      />
    </>
  )
}
