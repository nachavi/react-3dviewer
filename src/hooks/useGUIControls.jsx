// hooks/useGUIControls.js
import { useEffect } from 'react'
import GUI from 'lil-gui'

const hdriOptions = {
  'Pink Sunrise': 'pink_sunrise_1k.hdr',
  'Kloppenheim': 'kloppenheim_06_puresky_1k.hdr',
  'Road': 'goegap_road_1k.hdr',
  'Suburban Parking': 'suburban_parking_area_1k.hdr',
  'Skylight Parking': 'skylit_garage_1k.hdr',
  'Autoshop': 'autoshop_01_1k.hdr',
}

export function useGUIControls(controls, setControls) {
  useEffect(() => {
    const gui = new GUI()
    
    // Environment controls
    const envFolder = gui.addFolder('Environment')
    envFolder.add(controls, 'exposure', 0, 4, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, exposure: value })))
    envFolder.add(controls, 'showHDRIBackground')
      .onChange(value => setControls(prev => ({ ...prev, showHDRIBackground: value })))
    envFolder.add(controls, 'selectedHdri', {
      'Pink Sunrise': 'pink_sunrise_1k.hdr',
      'Kloppenheim': 'kloppenheim_06_puresky_1k.hdr',
      'Road': 'goegap_road_1k.hdr',
      'Suburban Parking': 'suburban_parking_area_1k.hdr',
      'Skylight Parking': 'skylit_garage_1k.hdr',
      'Autoshop': 'autoshop_01_1k.hdr',
    }).onChange(value => setControls(prev => ({ ...prev, selectedHdri: value })))
    envFolder.add(controls, 'environmentIntensity', 0, 5, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, environmentIntensity: value })))
    envFolder.addColor(controls, 'backgroundColor')
      .onChange(value => setControls(prev => ({ ...prev, backgroundColor: value })))

    // Particle controls
    const particleFolder = gui.addFolder('Particles')
    
    // Basic particle properties
    particleFolder.add(controls, 'particleSize', 0.1, 10, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleSize: value })))
    particleFolder.add(controls, 'particlesPerBurst', 1, 10, 1)
      .onChange(value => setControls(prev => ({ ...prev, particlesPerBurst: value })))
    particleFolder.add(controls, 'particleLifeTime', 0.1, 5, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleLifeTime: value })))

    // Material properties
    const materialFolder = particleFolder.addFolder('Material')
    materialFolder.add(controls, 'particleMetalness', 0, 1, 0.01)
      .onChange(value => setControls(prev => ({ ...prev, particleMetalness: value })))
    materialFolder.add(controls, 'particleRoughness', 0, 1, 0.01)
      .onChange(value => setControls(prev => ({ ...prev, particleRoughness: value })))
    materialFolder.add(controls, 'particleEnvMapIntensity', 0, 5, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleEnvMapIntensity: value })))
    materialFolder.addColor(controls, 'particleColor')
      .onChange(value => setControls(prev => ({ ...prev, particleColor: value })))
    materialFolder.add(controls, 'particleOpacity', 0, 1, 0.01)
      .onChange(value => setControls(prev => ({ ...prev, particleOpacity: value })))

    // Size variation
    const sizeFolder = particleFolder.addFolder('Size Variation')
    sizeFolder.add(controls, 'particleSizeMin', 0.1, 1, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleSizeMin: value })))
    sizeFolder.add(controls, 'particleSizeMax', 1, 3, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleSizeMax: value })))

    // Physics controls
    const physicsFolder = particleFolder.addFolder('Physics')
    physicsFolder.add(controls, 'particleRestitution', 0, 2, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, particleRestitution: value })))
    physicsFolder.add(controls, 'particleGravity', 0, 50, 1)
      .onChange(value => setControls(prev => ({ ...prev, particleGravity: value })))

    // Shape controls
    const shapeFolder = particleFolder.addFolder('Shape')
    shapeFolder.add(controls, 'sphereChance', 0, 1, 0.1)
      .name('Sphere Chance')
      .onChange(value => setControls(prev => ({ ...prev, sphereChance: value })))

    // Ground controls
    const groundFolder = gui.addFolder('Ground')
    groundFolder.add(controls, 'groundHeight', -50, 50, 1)
      .onChange(value => setControls(prev => ({ ...prev, groundHeight: value })))
    groundFolder.add(controls, 'groundRestitution', 0, 1, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, groundRestitution: value })))
    groundFolder.add(controls, 'groundFriction', 0, 1, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, groundFriction: value })))
    groundFolder.addColor(controls, 'floorColor')
      .onChange(value => setControls(prev => ({ ...prev, floorColor: value })))
    groundFolder.add(controls, 'floorOpacity', 0, 1, 0.1)
      .onChange(value => setControls(prev => ({ ...prev, floorOpacity: value })))

    return () => gui.destroy()
  }, [])
}