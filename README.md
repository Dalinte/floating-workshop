# Floating Workshop

Personal portfolio site — a tiny floating island in the sky that serves as a developer's workshop. A UFO delivers content (about, projects, contact) into the scene as a metaphor for navigation.

Built with Vite + React 18 + React Three Fiber + Zustand + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

## Edit content

All copy lives in `src/data/deliveries.js`. Update the `about`, `projects`, and `contact` entries — the navigation, panel content, and UFO cargo color/shape all derive from this file.

## Swap the placeholder character for a real model

The character is built from primitives in `src/components/Character.jsx`. To use a GLTF/GLB instead:

1. Drop the file at `public/models/character.glb`.
2. In `Character.jsx`, uncomment the GLTF block at the top of the file and remove (or wrap) the primitive geometry below it.

## Add a new delivery type

1. Add a new key (e.g. `writing`) to `src/data/deliveries.js` with a `cargo` (e.g. `'tablet'`) and `cargoColor`.
2. (Optional) Add a new shape branch in `src/components/DeliveryItem.jsx` keyed on the new `cargo` value.
3. The `Navigation` component picks up new entries automatically via `deliveryList`.

## Architecture notes

- `src/store.js` — zustand store. Phase machine drives every animation.
- `src/components/DeliverySequence.jsx` — orchestrator that sequences UFO arrival, beam, character/cargo spawn, and departure based on the current phase.
- `src/components/Scene.jsx` — Canvas, lights, postprocessing (Bloom for the beam + neon LEDs).
- `src/components/CameraController.jsx` — wraps OrbitControls; disables them and tweens the camera during cinematic phases.

## Credits

UFO, character, island, and workshop are all primitive geometry — no external assets required.
