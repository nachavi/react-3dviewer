import { createNoise4D } from 'simplex-noise'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function HandheldCamera({ basePosition, intensity = 1, frequency = 1 }) {
  const noise = useRef(createNoise4D())
  const cameraRef = useRef()
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta * frequency

    // Generate noise for each axis
    const xNoise = noise.current(time.current, 0, 0, 0) * intensity
    const yNoise = noise.current(0, time.current, 0, 0) * intensity
    const zNoise = noise.current(0, 0, time.current, 0) * intensity

    // Apply noise to camera position
    cameraRef.current.position.x = basePosition.x + xNoise
    cameraRef.current.position.y = basePosition.y + yNoise
    cameraRef.current.position.z = basePosition.z + zNoise
  })

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[basePosition.x, basePosition.y, basePosition.z]} 
      fov={50} 
    />
  )
}