import * as THREE from 'three'

// Where the UFO drops a creature in island-local XZ.
export const CREATURE_DROP_X = 1.4
export const CREATURE_DROP_Z = 0.6
// Local Y of a creature standing on the grass top.
export const CREATURE_BASE_Y = 0.4

// Where creatures slurp toward during the cleanup animation, in island-local
// coords. The UFO hovers over the island center at world (0, 4.5, 0); the
// island sits at world (0, ~1, 0); so local target ≈ (0, 3.5, 0).
export const CLEANUP_TARGET_LOCAL = new THREE.Vector3(0, 3.5, 0)
