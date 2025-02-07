import * as THREE from 'three'

export function Ground({ height = -10, color = '#303030', opacity = 0.3 }) {
  return (
    <>
      {/* Colored ground */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} 
        position={[0, height, 0]}
      >
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={opacity}
          roughness={0.0}
          metalness={0.0}
          depthWrite={false}
        />
      </mesh>

      {/* Shadow catching ground */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} 
        position={[0, height + 0.1, 0]}
      >
        <planeGeometry args={[3000, 3000]} />
        <shadowMaterial 
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}