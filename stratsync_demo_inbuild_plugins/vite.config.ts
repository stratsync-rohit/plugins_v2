import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { existsSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      // only copy icons if the public/icons folder exists to avoid build errors
      targets: (() => {
        const targets: any[] = [{ src: 'public/manifest.json', dest: '.' }]
        const iconsDir = resolve(__dirname, 'public', 'icons')
        if (existsSync(iconsDir)) {
          targets.push({ src: 'public/icons/*', dest: 'icons' })
        }
        return targets
      })()
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/serviceWorker.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        // keep names predictable for manifest references (no hashes for entry points)
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
