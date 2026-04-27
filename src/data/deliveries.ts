import type { DeliveryId } from '../store.ts'

export interface ProjectItemMeta {
  link: string
}

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
    id: 'projects',
    itemLinks: ['#', '#', '#'],
  },
  contact: {
    id: 'contact',
    email: 'hello@example.com',
  },
}

export const deliveryList: DeliveryMeta[] = Object.values(deliveries)
