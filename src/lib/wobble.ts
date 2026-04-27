export const ISLAND_BASE_Y = 1.0

export function islandWobbleY(t: number): number {
  return Math.sin(t * 0.6) * 0.15
}

export function islandWobbleRotZ(t: number): number {
  return Math.sin(t * 0.4) * 0.02
}

export function islandWobbleRotX(t: number): number {
  return Math.sin(t * 0.5) * 0.015
}
