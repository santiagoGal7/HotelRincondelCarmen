import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display text-4xl tracking-tight sm:text-6xl">El Rincón del Carmen</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Carrera 10 #25-30, Carmen de Apicalá, Tolima. Tres habitaciones, desayuno incluido y una
            piscina en el patio.
          </p>
        </div>
        <div className="grid gap-2 text-sm md:col-span-3">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Casa</p>
          <Link to="/habitaciones">Habitaciones</Link>
          <a href="/#servicios">Servicios</a>
          <Link to="/reservar">Reservar</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="grid gap-2 text-sm md:col-span-3">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Cuenta</p>
          <Link to="/entrar">Entrar o registrarse</Link>
          <Link to="/cuenta">Mis reservas</Link>
          <Link to="/soporte">Quejas y reclamos</Link>
          <Link to="/admin">Recepción</Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 border-t border-line px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Hotel El Rincón del Carmen</p>
        <p>Fotografía de archivo · Unsplash. Datos de demostración en este navegador.</p>
      </div>
    </footer>
  )
}
