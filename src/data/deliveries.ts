import type { DeliveryId } from '../store.ts'

export type CreatureType = 'rabbit' | 'fox' | 'turtle'

export interface DeliveryMeta {
  id: DeliveryId
  creature: CreatureType
  itemLinks?: string[]
}

export const deliveries: Record<DeliveryId, DeliveryMeta> = {
  about: {
    id: 'about',
    creature: 'rabbit',
  },
  projects: {
    // itemLinks must stay in lockstep with deliveries.projects.items in
    // src/i18n/locales/{en,ru}.json — the renderer pairs them by index.
    id: 'projects',
    itemLinks: ['#', '#', '#'],
    creature: 'fox',
  },
  contact: {
    id: 'contact',
    creature: 'turtle',
  },
}

export const deliveryList: DeliveryMeta[] = Object.values(deliveries)
