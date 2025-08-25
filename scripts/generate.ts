#!/usr/bin/env tsx

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

interface IconInfo {
  name: string
  content: string
  viewBox: string
  originalName: string
}

/**
 * Convert kebab-case or snake_case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, char => char.toUpperCase())
}

/**
 * Convert PascalCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

/**
 * Extract icon information from JSON data
 */
function extractIconInfoFromJson(iconData: any): IconInfo {
  const name = toPascalCase(iconData.name)

  // 从 SVG 内容中提取 viewBox
  const viewBoxMatch = iconData.svg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

  // 从 SVG 内容中提取 width 和 height（暂时不使用）
  const _widthMatch = iconData.svg.match(/width="([^"]+)"/)
  const _heightMatch = iconData.svg.match(/height="([^"]+)"/)
  const _width = _widthMatch ? Number.parseInt(_widthMatch[1], 10) : undefined
  const _height = _heightMatch ? Number.parseInt(_heightMatch[1], 10) : undefined

  // 提取 SVG 内容（移除 svg 标签本身）
  const contentMatch = iconData.svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const content = contentMatch ? contentMatch[1] : iconData.svg

  return {
    name,
    content,
    viewBox,
    originalName: iconData.name,
  }
}

/**
 * Generate React icon component
 */
function generateReactIcon(icon: IconInfo): string {
  return `import type { IconProps } from '../../types'
import { createIcon } from '../index'

const ${icon.name}Data = {
  name: '${icon.name}',
  content: \`${icon.content}\`,
  viewBox: '${icon.viewBox}',
}

export const ${icon.name} = createIcon(${icon.name}Data)
export default ${icon.name}
`
}

/**
 * Generate Vue icon component
 */
function generateVueIcon(icon: IconInfo): string {
  return `import { createIcon } from '../index'

const ${icon.name}Data = {
  name: '${icon.name}',
  content: \`${icon.content}\`,
  viewBox: '${icon.viewBox}',
}

export const ${icon.name} = createIcon(${icon.name}Data)
export default ${icon.name}
`
}

/**
 * Generate generic icon data
 */
function generateIconData(icon: IconInfo): string {
  return `import type { IconData } from '../types'

export const ${icon.name}Data: IconData = {
  name: '${icon.name}',
  content: \`${icon.content}\`,
  viewBox: '${icon.viewBox}',
}

// Export the icon name for tree-shaking
export const ${icon.name} = ${icon.name}Data
export default ${icon.name}Data
`
}

/**
 * Generate index file with all exports
 */
function generateIndex(icons: IconInfo[], framework?: 'react' | 'vue'): string {
  const imports = icons.map(icon =>
    `import { ${icon.name} } from './${toKebabCase(icon.name)}'`,
  ).join('\n')

  const exports = icons.map(icon =>
    `export { ${icon.name} }`,
  ).join('\n')

  const exportAll = `
// Export all icons
export const Icons = {
${icons.map(icon => `  ${icon.name},`).join('\n')}
}

// Export icon names for dynamic imports
export const IconNames = [
${icons.map(icon => `  '${icon.name}',`).join('\n')}
] as const

export type IconName = typeof IconNames[number]
`

  if (framework) {
    return `${imports}

// Re-export framework utilities
export * from '../index'

${exports}
${exportAll}`
  }

  return `${imports}

${exports}
${exportAll}
// Re-export core utilities
export * from '../core'
export * from '../types'
`
}

async function main() {
  console.log('🎨 Generating icon components from JSON...')

  // Ensure directories exist
  const dirs = [
    'src/icons',
    'src/react/icons',
    'src/vue/icons',
  ]

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  }

  // Read icons from JSON file
  const iconsJsonPath = 'public/icons/index.json'

  if (!existsSync(iconsJsonPath)) {
    console.log('❌ Icons JSON file not found at icons/index.json')
    return
  }

  const iconsJsonContent = await readFile(iconsJsonPath, 'utf-8')
  const iconsData = JSON.parse(iconsJsonContent)

  if (!Array.isArray(iconsData)) {
    console.log('❌ Invalid JSON format: expected array of icons')
    return
  }

  console.log(`📦 Found ${iconsData.length} icons in JSON file`)

  const icons: IconInfo[] = []

  // Process each icon from JSON
  for (const iconData of iconsData) {
    if (!iconData.name || !iconData.svg) {
      console.log(`⚠️  Skipping invalid icon data: ${JSON.stringify(iconData)}`)
      continue
    }

    const iconInfo = extractIconInfoFromJson(iconData)
    icons.push(iconInfo)

    console.log(`✅ Processed ${iconData.name} -> ${iconInfo.name}`)
  }

  // Generate icon data files
  for (const icon of icons) {
    const fileName = toKebabCase(icon.name)

    // Generate generic icon data
    const dataContent = generateIconData(icon)
    await writeFile(`src/icons/${fileName}.ts`, dataContent)

    // Generate React component
    const reactContent = generateReactIcon(icon)
    await writeFile(`src/react/icons/${fileName}.ts`, reactContent)

    // Generate Vue component
    const vueContent = generateVueIcon(icon)
    await writeFile(`src/vue/icons/${fileName}.ts`, vueContent)
  }

  // Generate index files
  const genericIndex = generateIndex(icons)
  await writeFile('src/icons/index.ts', genericIndex)

  const reactIndex = generateIndex(icons, 'react')
  await writeFile('src/react/icons/index.ts', reactIndex)

  const vueIndex = generateIndex(icons, 'vue')
  await writeFile('src/vue/icons/index.ts', vueIndex)

  console.log(`🎉 Generated ${icons.length} icon components for React and Vue!`)
  console.log('📋 Generated files:')
  console.log('  - Generic icon data: src/icons/')
  console.log('  - React components: src/react/icons/')
  console.log('  - Vue components: src/vue/icons/')
}

// Always run the main function when this script is executed
main().catch(console.error)
