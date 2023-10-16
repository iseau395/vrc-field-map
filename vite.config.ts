import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const dev_mode = !process.env.VITEST && import.meta?.env?.DEV;

export default defineConfig({
    base: "/vrc-field-map/",
    plugins: [svelte({ hot: dev_mode, compilerOptions: { dev: dev_mode } })],
    build: {
        outDir: "./dist"
    },
    define: {
        "import.meta.vitest": "undefined",
    },
    test: {
        include: ["test/**/*.test.ts"],
        environment: "jsdom",
        globals: true
    }
});
