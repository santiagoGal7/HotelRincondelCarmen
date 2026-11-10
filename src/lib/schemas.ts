import { z } from 'zod'

const phone = z
  .string()
  .trim()
  .refine((value) => {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  }, 'Usa entre 7 y 15 dígitos.')

export const guestSchema = z.object({
  nombre: z.string().trim().min(3, 'Escribe el nombre completo.'),
  email: z.string().trim().email('El correo no es válido.'),
  telefono: phone,
  notas: z.string().trim().max(400, 'Máximo 400 caracteres.').optional(),
})

export const registerSchema = z.object({
  id: z.string().trim().min(4, 'La identificación es muy corta.'),
  nombre: z.string().trim().min(3, 'Escribe el nombre completo.'),
  nacionalidad: z.string().trim().min(3, 'Indica la nacionalidad.'),
  email: z.string().trim().email('El correo no es válido.'),
  telefono: phone,
  password: z.string().min(6, 'La contraseña necesita al menos 6 caracteres.'),
})

export const loginSchema = z.object({
  id: z.string().trim().min(1, 'Escribe la identificación.'),
  password: z.string().min(1, 'Escribe la contraseña.'),
})

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, 'Escribe el usuario.'),
  password: z.string().min(1, 'Escribe la contraseña.'),
})

export const contactSchema = z.object({
  nombre: z.string().trim().min(3, 'Escribe tu nombre.'),
  email: z.string().trim().email('El correo no es válido.'),
  mensaje: z.string().trim().min(10, 'Cuéntanos un poco más.'),
})

export const ticketSchema = z.object({
  reservaId: z.string().min(1, 'Elige una reserva.'),
  asunto: z.string().trim().min(4, 'El asunto es muy corto.'),
  tipo: z.enum(['Queja', 'Reclamo']),
  descripcion: z.string().trim().min(10, 'Describe lo que pasó.'),
})

export type GuestValues = z.infer<typeof guestSchema>
export type RegisterValues = z.infer<typeof registerSchema>
