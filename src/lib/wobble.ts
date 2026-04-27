export const ISLAND_BASE_Y = 1.0

export function islandWobbleY(t: number): number {
  return Math.sin(t * 0.6) * 0.15
}
