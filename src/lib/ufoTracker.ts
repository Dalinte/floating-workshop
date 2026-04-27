import * as THREE from 'three'

// Latest UFO world position. Written by the UFO each frame, read by
// UfoShadow to draw a blob shadow on the grass directly under it.
// Initial Y is high so the shadow is hidden at startup.
export const ufoWorldPos = new THREE.Vector3(0, 100, 0)
