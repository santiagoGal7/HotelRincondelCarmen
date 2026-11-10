import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MarketingLayout } from '@/components/layout/marketing-layout'
import { SmoothScroll } from '@/components/layout/smooth-scroll'
import { HotelProvider, useHotel } from '@/lib/hotel-context'
import { ThemeProvider } from '@/lib/theme'
import { HomePage } from '@/features/home/home-page'
import { RoomsPage } from '@/features/rooms/rooms-page'
import { RoomPage } from '@/features/rooms/room-page'
import { ContactPage } from '@/features/contact/contact-page'

const BookingPage = lazy(() =>
  import('@/features/booking/booking-page').then((module) => ({ default: module.BookingPage })),
)
const AuthPage = lazy(() =>
  import('@/features/auth/auth-page').then((module) => ({ default: module.AuthPage })),
)
const AccountPage = lazy(() =>
  import('@/features/account/account-page').then((module) => ({ default: module.AccountPage })),
)
const SupportPage = lazy(() =>
  import('@/features/support/support-page').then((module) => ({ default: module.SupportPage })),
)
const AdminPage = lazy(() =>
  import('@/features/admin/admin-page').then((module) => ({ default: module.AdminPage })),
)

function RequireUser({ children }: { children: ReactNode }) {
  const { session } = useHotel()
  const location = useLocation()
  if (session.role === 'admin') return <Navigate to="/admin" replace />
  if (session.role !== 'user')
    return <Navigate to={`/entrar?next=${encodeURIComponent(location.pathname)}`} replace />
  return children
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { session } = useHotel()
  if (session.role !== 'admin') return <Navigate to="/entrar?next=/admin" replace />
  return children
}

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pt-36 pb-20 sm:px-8">
      <h1 className="font-display text-5xl tracking-tight">Esa página no existe.</h1>
      <a href="/" className="mt-6 inline-flex underline underline-offset-4">
        Volver al inicio
      </a>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <HotelProvider>
        <BrowserRouter>
          <SmoothScroll />
          <Suspense fallback={<p className="px-5 pt-32 text-sm text-muted">Cargando…</p>}>
            <Routes>
              <Route element={<MarketingLayout />}>
                <Route index element={<HomePage />} />
                <Route path="habitaciones" element={<RoomsPage />} />
                <Route path="habitaciones/:slug" element={<RoomPage />} />
                <Route path="reservar" element={<BookingPage />} />
                <Route path="reservar/:slug" element={<BookingPage />} />
                <Route path="entrar" element={<AuthPage />} />
                <Route path="contacto" element={<ContactPage />} />
                <Route
                  path="cuenta"
                  element={
                    <RequireUser>
                      <AccountPage />
                    </RequireUser>
                  }
                />
                <Route
                  path="soporte"
                  element={
                    <RequireUser>
                      <SupportPage />
                    </RequireUser>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route
                path="admin"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HotelProvider>
    </ThemeProvider>
  )
}
