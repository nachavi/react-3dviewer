import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glslify from 'rollup-plugin-glslify'

export default defineConfig({
  base: "/react-3dviewer/", // Add this line for GitHub Pages deployment
  plugins: [react(), glslify()],
  assetsInclude: ['**/*.exr', '**/*.hdr'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'postprocessing': ['@react-three/postprocessing', 'postprocessing'],
          'drei': ['@react-three/drei'],
          'fiber': ['@react-three/fiber']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    include: [
      'three',
      'three/examples/jsm/postprocessing/EffectComposer',
      'three/examples/jsm/postprocessing/RenderPass',
      'three/examples/jsm/postprocessing/ShaderPass',
      '@react-three/postprocessing',
      'postprocessing',
      '@react-three/drei',
      '@react-three/fiber'
    ]
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true
    },
    hmr: {
      host: 'localhost'
    }
  },
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true
    }
  },
  resolve: {
    dedupe: ['three']
  },
  define: {
    'process.env': {}
  }
})
