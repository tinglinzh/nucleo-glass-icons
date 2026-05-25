import { dts } from 'rolldown-plugin-dts'
import { cleanupPlugin, createVisualizerPlugin, iconGeneratorPlugin } from './plugins'

const EXTERNAL = ['react', 'vue'] as const

function mainConfig(entry: string, outDir: string, statsTemplate: 'sunburst' | 'network') {
  return {
    input: entry,
    output: [
      { file: `${outDir}/index.mjs`, format: 'esm' as const, sourcemap: false },
      { file: `${outDir}/index.cjs`, format: 'cjs' as const, sourcemap: false },
    ],
    external: EXTERNAL,
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    treeshake: true as const,
    minify: true as const,
    plugins: [
      iconGeneratorPlugin(),
      createVisualizerPlugin(`${outDir}/stats.html`, statsTemplate),
    ],
  }
}

function dtsConfig(entry: string, outDir: string, withCleanup = false) {
  const dtsPlugin = dts({ emitDtsOnly: true })
  return {
    input: entry,
    output: [{ dir: outDir, format: 'esm' as const }],
    external: EXTERNAL,
    plugins: withCleanup ? [dtsPlugin, cleanupPlugin()] : [dtsPlugin],
  }
}

export function createReactConfig() {
  return [
    mainConfig('src/react/index.ts', 'dist/react', 'sunburst'),
    dtsConfig('src/react/index.ts', 'dist/react'),
  ]
}

export function createVueConfig() {
  return [
    mainConfig('src/vue/index.ts', 'dist/vue', 'network'),
    // Cleanup runs on the last sub-build so the generated icon sources stay
    // alive long enough for every prior task to finish reading them.
    dtsConfig('src/vue/index.ts', 'dist/vue', true),
  ]
}
