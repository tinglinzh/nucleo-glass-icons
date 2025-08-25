import { defineConfig } from 'rolldown'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig([
  // Main entry
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/stats-main.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ],
  },
  // React entry
  {
    input: 'src/react.ts',
    output: [
      {
        file: 'dist/react.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/react.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/stats-react.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'sunburst',
      }),
    ],
  },
  // Vue entry
  {
    input: 'src/vue.ts',
    output: [
      {
        file: 'dist/vue.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/vue.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react', 'vue'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      visualizer({
        filename: 'dist/stats-vue.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'network',
      }),
    ],
  },
])
