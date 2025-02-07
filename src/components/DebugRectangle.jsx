import * as THREE from 'three'

export function DebugRectangle({ 
  position = [0, 10, -20], 
  size = [10, 10, 1], 
  rotation = [0, 0, 0]
}) {
    return (
      <mesh 
        position={position}
        rotation={rotation}
        receiveShadow
        castShadow
      >
        <boxGeometry args={size} />
        <meshPhysicalMaterial 
          metalness={1}
          roughness={0}
          envMapIntensity={1}
          color="#ffffff"
          shadowSide={THREE.DoubleSide}
          side={THREE.DoubleSide}
        />
      </mesh>
    )
}