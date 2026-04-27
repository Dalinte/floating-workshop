export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffd4a3" />
      <hemisphereLight color="#ffa500" groundColor="#4a3a8a" intensity={0.3} />
      <directionalLight
        castShadow
        position={[6, 10, 4]}
        intensity={1.0}
        color="#ffe4b5"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  )
}
