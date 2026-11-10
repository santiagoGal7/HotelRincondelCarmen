import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="shell py-16 md:py-24">
        <div className="rule mb-8" />
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="type-kicker text-muted">Hotel · Tolima</p>
            <p className="type-h1 mt-3 max-w-xl">El Rincón del Carmen</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Carrera 10 #25-30, Carmen de Apicalá. Tres habitaciones, desayuno incluido y una piscina en el patio.
            </p>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Button asChild variant="primary" arrow magnetic>
              <Link to="/reservar">Reservar la estancia</Link>
            </Button>
          </div>
        </div>
        <div className="mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <nav className="grid gap-2 text-sm" aria-label="Casa">
            <p className="type-kicker text-muted">Casa</p>
            <Link to="/habitaciones" className="w-fit hover:underline">Habitaciones</Link>
            <a href="/#servicios" className="w-fit hover:underline">Servicios</a>
            <Link to="/contacto" className="w-fit hover:underline">Contacto</Link>
          </nav>
          <nav className="grid gap-2 text-sm" aria-label="Cuenta">
            <p className="type-kicker text-muted">Cuenta</p>
            <Link to="/entrar" className="w-fit hover:underline">Entrar o registrarse</Link>
            <Link to="/cuenta" className="w-fit hover:underline">Mis reservas</Link>
            <Link to="/soporte" className="w-fit hover:underline">Quejas y reclamos</Link>
          </nav>
          <div className="grid gap-2 text-sm">
            <p className="type-kicker text-muted">Recepción</p>
            <a href="tel:+571234567890">+57 123 456 7890</a>
            <a href="mailto:info@rincondelcarmen.com">info@rincondelcarmen.com</a>
            <Link to="/admin" className="w-fit hover:underline">Panel de la casa</Link>
          </div>
        </div>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-line py-5 pb-24 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Hotel El Rincón del Carmen</p>
        <p>Fotografía de archivo · Unsplash. Datos de demostración en este navegador.</p>
      </div>
    </footer>
  )
}
