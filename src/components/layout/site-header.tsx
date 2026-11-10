import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useHotel } from '@/lib/hotel-context'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

const links = [
  { to: '/habitaciones', label: 'Habitaciones' },
  { to: '/#servicios', label: 'Servicios', end: false },
  { to: '/contacto', label: 'Contacto' },
]

export function SiteHeader() {
  const { pathname } = useLocation()
  const { session, logout } = useHotel()
  const { theme, toggle } = useTheme()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const open = menuPath === pathname
  const overHero = pathname === '/' && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const account =
    session.role === 'admin'
      ? { to: '/admin', label: 'Recepción' }
      : session.role === 'user'
        ? { to: '/cuenta', label: session.user.nombre.split(' ')[0] }
        : { to: '/entrar', label: 'Entrar' }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors',
        overHero ? 'text-white' : 'border-b border-line bg-bg text-fg',
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Saltar al contenido
      </a>
      <div className="shell flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link to="/" className="flex items-center gap-3" aria-label="El Rincón del Carmen, inicio">
          <span className={cn('grid h-8 w-8 place-items-center', overHero ? 'bg-white' : 'bg-fg')}>
            <span className="h-2 w-2 bg-accent" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[0.95rem] tracking-tight">
              El Rincón del Carmen
            </span>
            <span
              className={cn(
                'font-mono text-[10px] tracking-[0.16em] uppercase',
                overHero ? 'text-white/75' : 'text-muted',
              )}
            >
              Hotel · Tolima
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Principal">
          {links.map((link) =>
            link.to.startsWith('/#') ? (
              <a key={link.to} href={link.to} className="hover:opacity-70">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn('hover:opacity-70', isActive && 'underline underline-offset-8')
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="grid h-10 w-10 place-items-center"
            aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema oscuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to={account.to} className="hidden text-sm hover:opacity-70 sm:inline">
            {account.label}
          </Link>
          {session.role !== 'guest' ? (
            <button
              type="button"
              onClick={logout}
              className="hidden text-sm hover:opacity-70 md:inline"
            >
              Salir
            </button>
          ) : null}
          <Link
            to="/reservar"
            className="hidden h-10 items-center bg-accent px-4 text-sm text-accent-fg sm:inline-flex"
          >
            Reservar
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setMenuPath((value) => (value === pathname ? null : pathname))}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="menu-movil"
          data-lenis-prevent
          className="fixed inset-0 top-16 z-50 overflow-y-auto bg-bg text-fg lg:hidden"
        >
          <nav className="grid px-5 py-6" aria-label="Móvil">
            <Link to="/" className="border-b border-line py-4 text-2xl font-display">
              Inicio
            </Link>
            {links.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="border-b border-line py-4 font-display text-2xl"
              >
                {link.label}
              </a>
            ))}
            <Link to={account.to} className="border-b border-line py-4 font-display text-2xl">
              {account.label}
            </Link>
            <Link to="/soporte" className="border-b border-line py-4 font-display text-2xl">
              Soporte
            </Link>
            {session.role !== 'guest' ? (
              <button
                type="button"
                onClick={logout}
                className="border-b border-line py-4 text-left font-display text-2xl"
              >
                Salir
              </button>
            ) : null}
            <Link
              to="/reservar"
              className="mt-6 inline-flex h-12 items-center justify-center bg-accent text-accent-fg"
            >
              Reservar estancia
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
