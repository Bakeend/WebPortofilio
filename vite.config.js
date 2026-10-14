import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: { groups: [{ name: 'three', test: /node_modules\/three\//, maxSize: 1_000_000 }] },
      },
    },
  },
  resolve: {
    // Use Three's exported source modules so unused renderer features can be removed.
    // OrbitControls resolves the same copy of Three as the globe.
    alias: [{ find: /^three$/, replacement: fileURLToPath(new URL('./node_modules/three/src/Three.js', import.meta.url)) }],
  },
})
