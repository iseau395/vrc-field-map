import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/vrc-field-map/",
    build: {
      outDir: './dist'
    },
    test: {
      globals: true,
      environment: 'jsdom'
    },
    plugins: [svelte({ hot: !process.env.VITEST })],
})
