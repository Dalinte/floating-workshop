import type { DeliveryId } from '../store.ts'

export type CargoType = 'capsule' | 'crate' | 'envelope'

export interface ProjectItem {
  name: string
  desc: string
  link: string
}

export interface Delivery {
  id: DeliveryId
  title: string
  body: string
  cargo: CargoType
  cargoColor: string
  items?: ProjectItem[]
  email?: string
}

export const deliveries: Record<DeliveryId, Delivery> = {
  about: {
    id: 'about',
    title: 'About Me',
    body: 'Independent developer crafting interactive web experiences. I love the spot where engineering meets play — shaders, small simulations, tools that feel like toys. Currently building things from a floating workshop in the sky.',
    cargo: 'capsule',
    cargoColor: '#7dd3fc',
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    body: 'A few things I have shipped recently.',
    items: [
      {
        name: 'Project Alpha',
        desc: 'A real-time collaborative whiteboard with WebRTC and CRDTs.',
        link: '#',
      },
      {
        name: 'Project Beta',
        desc: 'Generative ambient music sequencer running entirely in the browser.',
        link: '#',
      },
      {
        name: 'Project Gamma',
        desc: 'Self-hosted analytics dashboard with privacy-first event capture.',
        link: '#',
      },
    ],
    cargo: 'crate',
    cargoColor: '#fbbf24',
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    body: 'The fastest way to reach me is email. I usually respond within a day or two — open to freelance, collaborations, and interesting conversations.',
    email: 'hello@example.com',
    cargo: 'envelope',
    cargoColor: '#fb7185',
  },
}

export const deliveryList: Delivery[] = Object.values(deliveries)
