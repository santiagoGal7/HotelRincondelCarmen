import type { Store } from '@/lib/api/types'

export const seedStore: Store = {
  rooms: [
    {
      id: '2',
      slug: 'estandar-patio',
      nombre: 'Estándar Patio',
      tipo: 'estandar',
      resumen: 'Una cama, dos personas y wifi. Es la tarifa de entrada del hotel.',
      descripcion:
        'La Estándar Patio da al corredor del primer piso. Tiene una cama doble, escritorio y cortina blackout. El inventario original la define así: una cama, máximo dos personas, internet y $100.000 por noche.',
      camas: 1,
      maxPersonas: 2,
      precioNoche: 100000,
      superficie: 18,
      servicios: ['internet', 'aire acondicionado'],
      imagenes: ['room-standard-1', 'room-standard-2', 'bed-white', 'bath'],
    },
    {
      id: '1',
      slug: 'deluxe-jacuzzi',
      nombre: 'Deluxe Jacuzzi',
      tipo: 'deluxe',
      resumen: 'Dos camas y jacuzzi para cuatro. La que más se pide el fin de semana.',
      descripcion:
        'La Deluxe Jacuzzi conserva la ficha original: dos camas, cuatro personas, internet, minibar y jacuzzi, a $150.000 por noche. El jacuzzi está en el baño, no en la terraza. Si viajan cuatro, pidan las dos camas al reservar.',
      camas: 2,
      maxPersonas: 4,
      precioNoche: 150000,
      superficie: 32,
      servicios: ['internet', 'minibar', 'jacuzzi', 'aire acondicionado', 'caja fuerte'],
      imagenes: ['room-deluxe-1', 'room-deluxe-2', 'linen', 'bath-stone'],
    },
    {
      id: '3',
      slug: 'suite-valle',
      nombre: 'Suite Valle',
      tipo: 'suite',
      resumen: 'Tres camas y sitio para seis. La pieza grande de la casa.',
      descripcion:
        'La Suite Valle es la habitación familiar: tres camas, seis personas, internet y minibar, a $200.000 por noche. Mira al jardín interior y al cerro del valle.',
      camas: 3,
      maxPersonas: 6,
      precioNoche: 200000,
      superficie: 48,
      servicios: ['internet', 'minibar', 'vista al jardín', 'aire acondicionado', 'sala'],
      imagenes: ['room-suite-1', 'room-suite-2', 'suite-night', 'bedroom-warm'],
    },
  ],
  users: [],
  bookings: [],
  tickets: [],
  messages: [],
}

export function cloneSeed(): Store {
  return structuredClone(seedStore)
}
