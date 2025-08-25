import { defineConfig } from 'rolldown'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig([
  // Main entry
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/main/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/main/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/main/index.d.ts',
        format: 'esm',
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/main/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
        emitFile: false,
      }),
    ],
  },
  // React entry
  {
    input: 'src/react.ts',
    output: [
      {
        file: 'dist/react/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/react/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/react/index.d.ts',
        format: 'esm',
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/react/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'sunburst',
        emitFile: false,
      }),
    ],
  },
  // Vue entry
  {
    input: 'src/vue.ts',
    output: [
      {
        file: 'dist/vue/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/vue/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/vue/index.d.ts',
        format: 'esm',
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/vue/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'network',
        emitFile: false,
      }),
    ],
  },
])
