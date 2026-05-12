import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import tanstackRouter from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  // fuer Testkonfiguration hier noch was hinzufuegen evtl.
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // auskommentieren im vps server
  /*
  build: {
  outDir: 'dist',
  sourcemap: false,
  minify: 'terser', //macht code unleserlich
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.debug', 'console.info'],
    },
    mangle: {
      toplevel: true,
    },
    format: {
      comments: false,
    },
  },  
},
*/
})
