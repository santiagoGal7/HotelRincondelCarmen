import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '@/components/page-intro'
import { Button } from '@/components/ui/button'
import { controlClass, Field } from '@/components/ui/field'
import { Photo } from '@/components/photo'
import { useHotel } from '@/lib/hotel-context'
import { adminLoginSchema, loginSchema, registerSchema, type RegisterValues } from '@/lib/schemas'
import type { z } from 'zod'

type Mode = 'entrar' | 'registro' | 'recepcion'

function safeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null
  return value
}

export function AuthPage() {
  usePageTitle('Cuenta')
  const [mode, setMode] = useState<Mode>('entrar')
  const [error, setError] = useState<string | null>(null)
  const { login, register, loginAdmin } = useHotel()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))

  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })
  const adminForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
  })

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="relative hidden min-h-[100svh] lg:block">
        <Photo
          name="lobby"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <p className="absolute bottom-8 left-8 max-w-sm text-white">
          <span className="block font-display text-4xl tracking-tight">
            La cuenta es para seguir la reserva y escribir a recepción.
          </span>
        </p>
      </div>
      <div className="px-5 pt-28 pb-16 sm:px-10">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Cuenta</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Entra o regístrate.</h1>
        <div className="mt-8 flex gap-2" role="tablist" aria-label="Tipo de acceso">
          {(
            [
              ['entrar', 'Huésped'],
              ['registro', 'Registro'],
              ['recepcion', 'Recepción'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => {
                setMode(id)
                setError(null)
              }}
              className="chip"
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'entrar' ? (
          <form
            className="mt-8 grid max-w-md gap-4"
            noValidate
            onSubmit={loginForm.handleSubmit(async (values) => {
              setError(null)
              try {
                await login(values.id, values.password)
                navigate(next && next !== '/admin' ? next : '/cuenta')
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : 'No se pudo entrar')
              }
            })}
          >
            <Field label="Identificación" error={loginForm.formState.errors.id?.message}>
              <input
                className={controlClass}
                autoComplete="username"
                {...loginForm.register('id')}
              />
            </Field>
            <Field label="Contraseña" error={loginForm.formState.errors.password?.message}>
              <input
                className={controlClass}
                type="password"
                autoComplete="current-password"
                {...loginForm.register('password')}
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="primary" arrow loading={loginForm.formState.isSubmitting}>
              Entrar
            </Button>
          </form>
        ) : null}

        {mode === 'registro' ? (
          <form
            className="mt-8 grid max-w-md gap-4"
            noValidate
            onSubmit={registerForm.handleSubmit(async (values) => {
              setError(null)
              try {
                await register({ ...values, email: values.email.trim().toLowerCase() })
                navigate(next && next !== '/admin' ? next : '/cuenta')
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : 'No se pudo registrar')
              }
            })}
          >
            <Field label="Identificación" error={registerForm.formState.errors.id?.message}>
              <input className={controlClass} {...registerForm.register('id')} />
            </Field>
            <Field label="Nombre" error={registerForm.formState.errors.nombre?.message}>
              <input
                className={controlClass}
                autoComplete="name"
                {...registerForm.register('nombre')}
              />
            </Field>
            <Field label="Nacionalidad" error={registerForm.formState.errors.nacionalidad?.message}>
              <input className={controlClass} {...registerForm.register('nacionalidad')} />
            </Field>
            <Field label="Correo" error={registerForm.formState.errors.email?.message}>
              <input
                className={controlClass}
                type="email"
                autoComplete="email"
                {...registerForm.register('email')}
              />
            </Field>
            <Field label="Teléfono" error={registerForm.formState.errors.telefono?.message}>
              <input
                className={controlClass}
                type="tel"
                autoComplete="tel"
                {...registerForm.register('telefono')}
              />
            </Field>
            <Field label="Contraseña" error={registerForm.formState.errors.password?.message}>
              <input
                className={controlClass}
                type="password"
                autoComplete="new-password"
                {...registerForm.register('password')}
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="primary" arrow loading={registerForm.formState.isSubmitting}>
              Crear cuenta
            </Button>
          </form>
        ) : null}

        {mode === 'recepcion' ? (
          <form
            className="mt-8 grid max-w-md gap-4"
            noValidate
            onSubmit={adminForm.handleSubmit(async (values) => {
              setError(null)
              try {
                await loginAdmin(values.username, values.password)
                navigate('/admin')
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : 'No se pudo entrar')
              }
            })}
          >
            <p className="text-sm text-muted">
              Demostración: usuario <span className="font-mono">admin</span> y contraseña{' '}
              <span className="font-mono">admin123</span>.
            </p>
            <Field label="Usuario" error={adminForm.formState.errors.username?.message}>
              <input
                className={controlClass}
                autoComplete="username"
                {...adminForm.register('username')}
              />
            </Field>
            <Field label="Contraseña" error={adminForm.formState.errors.password?.message}>
              <input
                className={controlClass}
                type="password"
                autoComplete="current-password"
                {...adminForm.register('password')}
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="primary" arrow loading={adminForm.formState.isSubmitting}>
              Entrar a recepción
            </Button>
          </form>
        ) : null}

        <p className="mt-8 text-sm">
          <Link to="/" className="underline underline-offset-4">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
