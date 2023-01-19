/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/vrc-field-map/",
    build: {
        outDir: "./dist"
    },
    test: {
        include: ['test/**/*.test.ts'],
        environment: 'jsdom'
    },
    plugins: [svelte()],
});
