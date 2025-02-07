import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function HDRIToggleHandler({ showHDRIBackground, setCachedCubeMap }) {
  const { gl, scene } = useThree()

  useEffect(() => {
    if (!showHDRIBackground) {
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512)
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)
      cubeCamera.update(gl, scene)
      setCachedCubeMap(cubeRenderTarget.texture)
    }
  }, [showHDRIBackground, gl, scene, setCachedCubeMap])

  return null
}