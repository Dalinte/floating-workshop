import * as THREE from 'three'

// Latest creature world-XZ position. Written by the active creature each
// frame, read by DeliverySequence when the UFO needs to fly back to it.
// Y is irrelevant for UFO targeting (UFO Y is fixed), but kept here for completeness.
export const creatureWorldPos = new THREE.Vector3(0, 0, 0)
