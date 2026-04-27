import type { DeliveryId } from '../store.ts'

export interface DeliveryMeta {
  id: DeliveryId
  itemLinks?: string[]
  email?: string
}

export const deliveries: Record<DeliveryId, DeliveryMeta> = {
  about: {
    id: 'about',
  },
  projects: {
    // itemLinks must stay in lockstep with deliveries.projects.items in
    // src/i18n/locales/{en,ru}.json — the renderer pairs them by index.
    id: 'projects',
    itemLinks: ['#', '#', '#'],
  },
  contact: {
    id: 'contact',
    email: 'hello@example.com',
  },
}

export const deliveryList: DeliveryMeta[] = Object.values(deliveries)
