import * as THREE from 'three'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export function Tone({ exposure, selectedHdri }) {
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