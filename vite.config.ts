import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    base: "/vrc-field-map/",
    plugins: [svelte({ hot: !process.env.VITEST })],
    build: {
        outDir: "./dist"
    },
    define: {
      "import.meta.vitest": "undefined",
    },
    test: {
        include: ['test/**/*.test.ts'],
        environment: 'jsdom',
        globals: true
    }
});
