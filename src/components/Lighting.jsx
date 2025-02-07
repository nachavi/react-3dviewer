export function Lighting() {
  return (
    <>
      <directionalLight
        castShadow
        position={[50, 100, 50]}
        intensity={0.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-bias={-0.001}
      />
      <directionalLight
        castShadow
        position={[-30, 120, -30]}
        intensity={0.2}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.001}
      />
      <ambientLight intensity={0.1} />
    </>
  )
}