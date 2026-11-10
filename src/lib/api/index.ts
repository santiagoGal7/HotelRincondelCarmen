import { createHttpRepository } from '@/lib/api/http'
import { createStoreRepository, type KeyValueStorage } from '@/lib/api/store'
import type { HotelRepository } from '@/lib/api/types'

export function createRepository(storage?: KeyValueStorage): HotelRepository {
  if (import.meta.env.VITE_DATA_SOURCE === 'http') {
    return createHttpRepository(import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001')
  }
  const target =
    storage ??
    (typeof localStorage === 'undefined'
      ? {
          getItem: () => null,
          setItem: () => undefined,
        }
      : localStorage)
  return createStoreRepository(target)
}
