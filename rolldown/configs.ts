import { dts } from 'rolldown-plugin-dts'
import { cleanupPlugin, createVisualizerPlugin, iconGeneratorPlugin } from './plugins'

// React 构建配置
export function createReactConfig() {
  return [
    // React 主构建
    {
      input: 'src/react/index.ts',
      output: [
        {
          file: 'dist/react/index.mjs',
          format: 'esm' as const,
          sourcemap: true,
        },
        {
          file: 'dist/react/index.cjs',
          format: 'cjs' as const,
          sourcemap: true,
        },
      ],
      external: ['react', 'vue'],
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      plugins: [
        iconGeneratorPlugin(),
        createVisualizerPlugin('dist/react/stats.html', 'sunburst'),
      ],
    },
    // React DTS
    {
      input: 'src/react/index.ts',
      output: [{ dir: 'dist/react', format: 'esm' as const }],
      plugins: [dts()],
    },
  ]
}

// Vue 构建配置
export function createVueConfig() {
  return [
    // Vue 主构建
    {
      input: 'src/vue/index.ts',
      output: [
        {
          file: 'dist/vue/index.mjs',
          format: 'esm' as const,
          sourcemap: true,
        },
        {
          file: 'dist/vue/index.cjs',
          format: 'cjs' as const,
          sourcemap: true,
        },
      ],
      external: ['react', 'vue'],
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      plugins: [
        iconGeneratorPlugin(),
        createVisualizerPlugin('dist/vue/stats.html', 'network'),
      ],
    },
    // Vue DTS (包含清理插件)
    {
      input: 'src/vue/index.ts',
      output: [{ dir: 'dist/vue', format: 'esm' as const }],
      plugins: [dts(), cleanupPlugin()],
    },
  ]
}
