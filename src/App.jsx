import * as THREE from 'three'
import { useEffect, useState, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import GUI from 'lil-gui'
import Model from './sample.jsx' // Ensure this import uses the default export

// Debug sphere to visualize environment reflections
function DebugSphere({ position = [20, 20, 20], size = 10 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshPhysicalMaterial 
        metalness={1}
        roughness={0}
        envMapIntensity={1}
      />
    </mesh>
  )
}

// HDRI toggle handler component
function HDRIToggleHandler({ showHDRIBackground, setCachedCubeMap }) {
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

// Tone mapping component
function Tone({ exposure, selectedHdri }) {
  const gl = useThree((state) => state.gl)
  
  useEffect(() => {
    const prevFrag = THREE.ShaderChunk.tonemapping_pars_fragment
    
    THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
      'vec3 CustomToneMapping( vec3 color ) { return color; }',
      `float startCompression = 0.8 - 0.04;
       float desaturation = 0.15;
       vec3 CustomToneMapping( vec3 color ) {
         color *= toneMappingExposure;
         float x = min(color.r, min(color.g, color.b));
         float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
         color -= offset;
         float peak = max(color.r, max(color.g, color.b));
         if (peak < startCompression) return color;
         float d = 1. - startCompression;
         float newPeak = 1. - d * d / (peak + d - startCompression);
         color *= newPeak / peak;
         float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
         return mix(color, vec3(1, 1, 1), g);
       }`,
    )
    
    // Always set to Reinhard
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.toneMappingExposure = exposure
    
    return () => {
      gl.toneMapping = THREE.ReinhardToneMapping
      gl.toneMappingExposure = exposure
      THREE.ShaderChunk.tonemapping_pars_fragment = prevFrag
    }
  }, [exposure, selectedHdri])
  
  return null
}

export default function App() {
  const [cachedCubeMap, setCachedCubeMap] = useState(null)
  const [controls, setControls] = useState({
    exposure: 5.0,
    cameraPosition: { x: 100, y: 5, z: 200 },
    cameraRotation: { x: 0, y: Math.PI / 4, z: 0 },
    backgroundColor: '#202020',
    carColor: '#ffffff',
    showHDRIBackground: true,
    selectedHdri: 'pink_sunrise_1k.hdr',
  })

  const hdriOptions = {
    'Pink Sunrise': 'pink_sunrise_1k.hdr',
    'Kloppenheim': 'kloppenheim_06_puresky_1k.hdr',
    'Road': 'goegap_road_1k.hdr',
    'Suburban Parking': 'suburban_parking_area_1k.hdr',
    'Skylight Parking': 'skylit_garage_1k.hdr',
    'Autoshop': 'autoshop_01_1k.hdr',
  }

  // Setup GUI controls
  useEffect(() => {
    const gui = new GUI()
    
    gui.add(controls, 'exposure', 0, 4, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, exposure: value })))
    
    const cameraFolder = gui.addFolder('Camera Position')
    cameraFolder.add(controls.cameraPosition, 'x', -200, 250, 1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraPosition: { ...prev.cameraPosition, x: value }
      })))
    cameraFolder.add(controls.cameraPosition, 'y', -200, 200, 1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraPosition: { ...prev.cameraPosition, y: value }
      })))
    cameraFolder.add(controls.cameraPosition, 'z', -200, 200, 1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraPosition: { ...prev.cameraPosition, z: value }
      })))

    const cameraRotationFolder = gui.addFolder('Camera Rotation')
    cameraRotationFolder.add(controls.cameraRotation, 'x', -Math.PI, Math.PI, 0.1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraRotation: { ...prev.cameraRotation, x: value }
      })))
    cameraRotationFolder.add(controls.cameraRotation, 'y', -Math.PI, Math.PI, 0.1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraRotation: { ...prev.cameraRotation, y: value }
      })))
    cameraRotationFolder.add(controls.cameraRotation, 'z', -Math.PI, Math.PI, 0.1)
      .onChange(value => setControls(prev => ({ 
        ...prev, 
        cameraRotation: { ...prev.cameraRotation, z: value }
      })))


    gui.addColor(controls, 'backgroundColor')
      .onChange(value => setControls(prev => ({ ...prev, backgroundColor: value })))
    
    gui.addColor(controls, 'carColor')
      .onChange(value => setControls(prev => ({ ...prev, carColor: value })))
    
    gui.add(controls, 'showHDRIBackground')
      .onChange(value => setControls(prev => ({ ...prev, showHDRIBackground: value })))
    
    gui.add(controls, 'selectedHdri', Object.values(hdriOptions))
      .onChange(value => setControls(prev => ({ ...prev, selectedHdri: value })))

    return () => gui.destroy()
  }, [])

  return (
  <Canvas 
    shadows 
    gl={{ 
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      toneMapping: THREE.ReinhardToneMapping,  // Add this
      toneMappingExposure: controls.exposure    // Add this
    }}
    dpr={[1, 2]}
    >
      <HDRIToggleHandler 
        showHDRIBackground={controls.showHDRIBackground} 
        setCachedCubeMap={setCachedCubeMap}
      />
      <color attach="background" args={[controls.backgroundColor]} />
      <Environment 
        files={`/hdri/${controls.selectedHdri}`}
        ground={controls.showHDRIBackground ? { height: 70, radius: 400, scale: 200 } : null}
        background={controls.showHDRIBackground}
        intensity={1}
        resolution={1024}
      />
      <Model 
        position={[0, 0, -50]} 
        scale={10} 
        rotation={[0, -Math.PI / 4, 0]}
        carColor={controls.carColor}
        currentHdri={controls.selectedHdri}
        showHDRIBackground={controls.showHDRIBackground}
        cachedCubeMap={cachedCubeMap}
      />
      <DebugSphere position={[50, 10, 20]} size={10} />
      <PerspectiveCamera
        makeDefault
        position={[controls.cameraPosition.x, controls.cameraPosition.y, controls.cameraPosition.z]}
        rotation={[controls.cameraRotation.x, controls.cameraRotation.y, controls.cameraRotation.z]}
        fov={45}
      />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.25} 
        minDistance={50}
        maxDistance={200}
        makeDefault 
        target={[-8, 0, -2]}
      />
      <Tone exposure={controls.exposure} selectedHdri={controls.selectedHdri} />
    </Canvas>
  )
}