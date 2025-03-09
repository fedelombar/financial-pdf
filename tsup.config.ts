import { defineConfig } from "tsup";

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    dts: true, // decorations files
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
})