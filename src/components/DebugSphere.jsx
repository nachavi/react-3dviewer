import * as THREE from 'three'

export function DebugSphere({ 
  position = [20, 20, 20], 
  size = 10
}) {
  return (
    <mesh 
      position={position}
      receiveShadow
      castShadow
    >
      <sphereGeometry args={[size, 64, 64]} />
      <meshPhysicalMaterial 
        metalness={1}
        roughness={0}
        envMapIntensity={0.3}
        shadowSide={THREE.DoubleSide}
        aoMapIntensity={1}
      />
    </mesh>
  )
}