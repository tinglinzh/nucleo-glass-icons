import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { visualizer } from 'rollup-plugin-visualizer'
import { optimize } from 'svgo'

// ==================== icon generation ====================

const ICONS_JSON_PATH = 'public/icons/index.json'
const REACT_ICONS_DIR = 'src/react/icons'
const VUE_ICONS_DIR = 'src/vue/icons'

// Generation is shared across the 4 rolldown sub-builds. Guard so we only run
// it once per process (and once per watch round) instead of 4×.
let generationPromise: Promise<void> | null = null

function pascalCase(name: string): string {
  return name
    .replace(/[-_](.)/g, (_, ch: string) => ch.toUpperCase())
    .replace(/^(.)/, (_, ch: string) => ch.toUpperCase())
}

function optimizeSvg(rawSvg: string): { content: string, viewBox: string } {
  const result = optimize(rawSvg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            // Each icon has its own ID namespace; renaming is safe because
            // svgo also rewrites url(#...) references in the same pass.
            cleanupIds: { remove: true, minify: true },
          },
        },
      },
    ],
  })
  const optimized = result.data

  const viewBoxMatch = optimized.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

  const inner = optimized.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const content = inner ? inner[1] : optimized

  return { content, viewBox }
}

function generateReactIcon(componentName: string, viewBox: string, content: string): string {
  return `import { createIcon } from '../create'

export const ${componentName} = /* @__PURE__ */ createIcon({
  name: '${componentName}',
  viewBox: '${viewBox}',
  content: ${JSON.stringify(content)},
})

export default ${componentName}
`
}

function generateVueIcon(componentName: string, viewBox: string, content: string): string {
  return `import { createIcon } from '../create'

export const ${componentName} = /* @__PURE__ */ createIcon({
  name: '${componentName}',
  viewBox: '${viewBox}',
  content: ${JSON.stringify(content)},
})

export default ${componentName}
`
}

async function generateIndexFiles(componentNames: string[], fileNames: string[]) {
  const importLines = componentNames
    .map((name, i) => `import { ${name} } from './${fileNames[i]}'`)
    .join('\n')

  const reactIndex = `// Auto-generated at build time
${importLines}

export {
${componentNames.map(n => `  ${n},`).join('\n')}
}

export const Icons = [
${componentNames.map(n => `  ${n},`).join('\n')}
]

export const IconNames = [
${componentNames.map(n => `  '${n}',`).join('\n')}
] as const

export type IconName = typeof IconNames[number]
`

  const vueIndex = `// Auto-generated at build time
${importLines}

export {
${componentNames.map(n => `  ${n},`).join('\n')}
}

export const Icons = [
${componentNames.map(n => `  ${n},`).join('\n')}
]

export const IconNames = [
${componentNames.map(n => `  '${n}',`).join('\n')}
] as const

export type IconName = typeof IconNames[number]
`

  await writeFile(`${REACT_ICONS_DIR}/index.ts`, reactIndex)
  await writeFile(`${VUE_ICONS_DIR}/index.ts`, vueIndex)
}

async function generateAllIcons() {
  if (!existsSync(ICONS_JSON_PATH)) {
    console.log(`❌ Icons JSON file not found at ${ICONS_JSON_PATH}`)
    return
  }

  const iconsData = JSON.parse(await readFile(ICONS_JSON_PATH, 'utf-8'))

  if (!Array.isArray(iconsData)) {
    console.log('❌ Invalid JSON format: expected array of icons')
    return
  }

  console.log(`📦 Generating ${iconsData.length} icons at build time...`)

  await Promise.all([
    mkdir(REACT_ICONS_DIR, { recursive: true }),
    mkdir(VUE_ICONS_DIR, { recursive: true }),
  ])

  const componentNames: string[] = []
  const fileNames: string[] = []

  await Promise.all(iconsData.map(async (icon: any) => {
    const componentName = pascalCase(icon.name)
    const fileName = icon.name.replace(/[-_]/g, '-').toLowerCase()
    const { content, viewBox } = optimizeSvg(icon.svg)

    await Promise.all([
      writeFile(`${REACT_ICONS_DIR}/${fileName}.ts`, generateReactIcon(componentName, viewBox, content)),
      writeFile(`${VUE_ICONS_DIR}/${fileName}.ts`, generateVueIcon(componentName, viewBox, content)),
    ])

    componentNames.push(componentName)
    fileNames.push(fileName)
  }))

  await generateIndexFiles(componentNames, fileNames)

  console.log('✅ All icons generated successfully!')
}

async function cleanupGeneratedIcons() {
  console.log('🧹 Cleaning up generated icon files...')
  try {
    await Promise.all([
      rm(REACT_ICONS_DIR, { recursive: true, force: true }),
      rm(VUE_ICONS_DIR, { recursive: true, force: true }),
    ])
    console.log('✅ Cleaned up generated icons')
  }
  catch (error) {
    console.log('⚠️  Warning: could not clean up icon files:', error)
  }
}

// ==================== plugins ====================

/**
 * Icon generator plugin.
 *
 * The shared `generationPromise` makes this idempotent across the 4 rolldown
 * sub-builds (react/vue × main/dts) — we only do the SVGO + filesystem work
 * once per build session.
 */
export function iconGeneratorPlugin() {
  return {
    name: 'icon-generator',
    async buildStart() {
      if (!generationPromise) {
        generationPromise = generateAllIcons().catch((err) => {
          generationPromise = null
          throw err
        })
      }
      await generationPromise
    },
  }
}

/**
 * Cleanup plugin. Must `await` the async cleanup so rolldown doesn't exit
 * before files are removed.
 */
export function cleanupPlugin() {
  return {
    name: 'cleanup-after-dts',
    async closeBundle() {
      await cleanupGeneratedIcons()
      // Reset so a subsequent watch round regenerates.
      generationPromise = null
    },
  }
}

export function createVisualizerPlugin(filename: string, template: 'sunburst' | 'network' = 'sunburst') {
  return visualizer({
    filename,
    open: false,
    gzipSize: true,
    brotliSize: true,
    template,
    emitFile: false,
  })
}
