import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log']
  },
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'EventModifier',
      formats: ['cjs', 'es', 'iife'],
      fileName: f => `index.${f === 'es' ? 'mjs' : f === 'cjs' ? 'cjs' : 'js'}`
    },
    rollupOptions: {
      external: ['@vue', 'vue']
    }
  },
  plugins: [dts({ rollupTypes: true })]
})
