// SpawnerPoint.jsx
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function SpawnerPoint({ 
  spawnRate = 0.05, 
  onSpawn,
  minHeight = 5,
  maxHeight = 50,
  offset = { x: 0, y: 0, z: 0 },
  bounds = {
    minX: -150, maxX: 150,
    minY: -15, maxY: 150,
    minZ: -150, maxZ: 150
  }
}) {
  const { camera } = useThree()
  const position = useRef([0, 10, 0])
  const lastSpawn = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const raycaster = useRef(new THREE.Raycaster())
  const intersectPoint = useRef(new THREE.Vector3())
  const isMouseDown = useRef(false)

  const getRandomRotation = () => {
    const randomRange = 0.5 // Adjust this value to control rotation speed
    return {
      x: (Math.random() - 0.5) * randomRange,
      y: (Math.random() - 0.5) * randomRange,
      z: (Math.random() - 0.5) * randomRange
    }
  }

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isMouseDown.current) {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.current.setFromCamera(mouse.current, camera)
        raycaster.current.ray.intersectPlane(plane.current, intersectPoint.current)
        
        const newX = Math.max(bounds.minX, Math.min(bounds.maxX, intersectPoint.current.x + offset.x))
        const newY = Math.max(bounds.minY, Math.min(bounds.maxY, intersectPoint.current.y + offset.y))
        const newZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, intersectPoint.current.z + offset.z))
        
        position.current = [newX, newY, newZ]
      }
    }

    const handleMouseDown = () => {
      isMouseDown.current = true
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [camera, minHeight, maxHeight, offset, bounds])

  useFrame((state) => {
    if (!isMouseDown.current && state.clock.getElapsedTime() - lastSpawn.current > spawnRate) {
      lastSpawn.current = state.clock.getElapsedTime()

      onSpawn({
        position: position.current,
        velocity: [0.0, 0.0, 0.0],
        angularVelocity: getRandomRotation() // Add this
      })
    }
  })

  return null
}