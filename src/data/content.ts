export const services = [
  {
    id: 'spa',
    title: 'Spa',
    kicker: 'Con cita',
    text: 'Masaje de una hora. Se aparta en recepción el mismo día o la víspera; no sale en la reserva de la habitación.',
    image: 'spa-1',
    alt: 'Manos vertiendo aceite durante un masaje',
    hours: 'Martes a domingo, 10:00–18:00',
  },
  {
    id: 'gastronomia',
    title: 'Gastronomía',
    kicker: 'Cocina de la casa',
    text: 'El desayuno va incluido. El almuerzo del fin de semana es corto: caldo, arroz, fruta del valle y un jugo.',
    image: 'dining-1',
    alt: 'Plato servido en la mesa del comedor',
    hours: 'Desayuno 7:30–10:00',
  },
  {
    id: 'piscina',
    title: 'Piscina',
    kicker: 'Patio',
    text: 'Una piscina, no un club. La toalla se pide en recepción y el agua se cierra antes de que anochezca.',
    image: 'courtyard',
    alt: 'Piscina rodeada de palmeras y techos bajos',
    hours: 'Todos los días, 8:00–19:00',
  },
] as const

export const amenities = [
  ['Wifi', 'En habitación y patio'],
  ['Desayuno', 'Incluido en la tarifa'],
  ['Aire', 'En las tres habitaciones'],
  ['Piscina', '8:00 a 19:00'],
  ['Spa', 'Con cita, de martes a domingo'],
  ['Parqueadero', 'Tres puestos, sin reserva'],
  ['Recepción', 'Alguien de la casa, día y noche'],
  ['Caja fuerte', 'En Deluxe y Suite'],
]

export const testimonials = [
  {
    quote:
      'Pedimos la Suite Valle para seis. Las tres camas estaban hechas y el desayuno salió a las ocho, sin teatro.',
    name: 'Laura Mendoza',
    detail: 'Estancia de ejemplo · familia de Ibagué',
  },
  {
    quote:
      'Llegamos el viernes a las cuatro. La Deluxe tenía el jacuzzi listo y el patio todavía con sol.',
    name: 'Camilo Herrera',
    detail: 'Estancia de ejemplo · fin de semana',
  },
  {
    quote:
      'La Estándar es justa de tamaño y la cama es buena. Para dos personas alcanza, y el precio se entiende.',
    name: 'Martina Ortiz',
    detail: 'Estancia de ejemplo · una noche',
  },
]

export const faq = [
  {
    q: '¿A qué hora es la entrada y la salida?',
    a: 'La entrada es a las 15:00 y la salida a las 12:00. La noche de la salida no se cobra: esa mañana la habitación queda libre.',
  },
  {
    q: '¿Hay que pagar en línea?',
    a: 'No. Esta versión confirma la reserva y calcula la tarifa, pero no cobra. El pago se haría en recepción si el hotel operara de verdad.',
  },
  {
    q: '¿Puedo reservar sin crear una cuenta?',
    a: 'Sí. Con nombre, correo y teléfono basta. Si después te registras con el mismo correo, la reserva aparece en tu cuenta.',
  },
  {
    q: '¿Cómo dejo una queja o un reclamo?',
    a: 'Hace falta una cuenta y una reserva a tu nombre. El ticket queda en Pendiente hasta que recepción responda. Solo se puede borrar mientras sigue pendiente.',
  },
  {
    q: '¿Aceptan mascotas?',
    a: 'No. El patio y la piscina se usan sin animales.',
  },
  {
    q: '¿Cómo se llega?',
    a: 'Carrera 10 #25-30, Carmen de Apicalá. Desde Melgar son unos quince minutos. Desde Bogotá, unas dos horas y media por Soacha.',
  },
]

export const mediaLibrary = [
  'room-standard-1',
  'room-standard-2',
  'room-deluxe-1',
  'room-deluxe-2',
  'room-suite-1',
  'room-suite-2',
  'bath',
  'lobby',
  'night',
  'courtyard',
  'exterior',
  'pool-1',
  'pool-2',
  'dining-1',
  'dining-2',
  'spa-1',
  'spa-2',
] as const

export const typeLabel: Record<string, string> = {
  estandar: 'Estándar',
  deluxe: 'Deluxe',
  suite: 'Suite',
}
