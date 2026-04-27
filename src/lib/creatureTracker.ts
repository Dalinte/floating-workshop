import * as THREE from 'three'

// Where the UFO drops a creature in island-local XZ. Both DeliverySequence
// (for the UFO/beam target) and the creature components (for their initial
// position) read these so the creature lands directly under the beam.
export const CREATURE_DROP_X = 1.4
export const CREATURE_DROP_Z = 0.6
// Local Y of a creature standing on the grass top.
export const CREATURE_BASE_Y = 0.4

// Latest creature world-XZ position. Written by the active creature each
// frame, read by DeliverySequence when the UFO needs to fly back to it.
// Y is irrelevant for UFO targeting (UFO Y is fixed), but kept here for completeness.
export const creatureWorldPos = new THREE.Vector3(CREATURE_DROP_X, 0, CREATURE_DROP_Z)
