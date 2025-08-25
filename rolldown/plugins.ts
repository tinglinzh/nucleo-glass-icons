import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { visualizer } from 'rollup-plugin-visualizer'

// ==================== 图标生成逻辑 ====================

// 清理生成的图标文件
async function cleanupGeneratedIcons() {
  console.log('🧹 Cleaning up generated icon files...')

  try {
    if (existsSync('src/react/icons')) {
      await rm('src/react/icons', { recursive: true, force: true })
      console.log('✅ Cleaned up src/react/icons')
    }

    if (existsSync('src/vue/icons')) {
      await rm('src/vue/icons', { recursive: true, force: true })
      console.log('✅ Cleaned up src/vue/icons')
    }
  }
  catch (error) {
    console.log('⚠️  Warning: Could not clean up some icon files:', error)
  }
}

// 生成所有图标
async function generateAllIcons() {
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

  console.log(`📦 Generating ${iconsData.length} icons at build time...`)

  // 确保目录存在
  const dirs = ['src/react/icons', 'src/vue/icons']
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
  }

  // 生成 React 图标
  for (const icon of iconsData) {
    const componentName = icon.name
      .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      .replace(/^(.)/, char => char.toUpperCase())

    const fileName = icon.name.replace(/[-_]/g, '-').toLowerCase()

    // 生成 React 组件
    const reactContent = generateReactIcon(icon, componentName)
    await writeFile(`src/react/icons/${fileName}.ts`, reactContent)

    // 生成 Vue 组件
    const vueContent = generateVueIcon(icon, componentName)
    await writeFile(`src/vue/icons/${fileName}.ts`, vueContent)
  }

  // 生成索引文件
  await generateIndexFiles(iconsData)

  console.log('✅ All icons generated successfully!')
}

// 生成 React 图标组件
function generateReactIcon(icon: any, componentName: string): string {
  const contentMatch = icon.svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const content = contentMatch ? contentMatch[1] : icon.svg

  const viewBoxMatch = icon.svg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

  return `import type { IconProps } from '../../types'
import React from 'react'

const ${componentName}Data = {
  name: '${componentName}',
  content: \`${content}\`,
  viewBox: '${viewBox}',
}

export const ${componentName}: React.FC<IconProps> = (props) => {
  const { size = 24, className, style, ...rest } = props
  const sizeValue = typeof size === 'number' ? \`\${size}px\` : size
  
  return React.createElement('svg', {
    width: sizeValue,
    height: sizeValue,
    viewBox: '${viewBox}',
    className,
    style,
    ...rest,
  }, React.createElement('g', { 
    dangerouslySetInnerHTML: { __html: \`${content}\` } 
  }))
}

export default ${componentName}
`
}

// 生成 Vue 图标组件
function generateVueIcon(icon: any, componentName: string): string {
  const contentMatch = icon.svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const content = contentMatch ? contentMatch[1] : icon.svg

  const viewBoxMatch = icon.svg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

  return `import { defineComponent, h } from 'vue'

const ${componentName}Data = {
  name: '${componentName}',
  content: \`${content}\`,
  viewBox: '${viewBox}',
}

export const ${componentName} = defineComponent({
  name: '${componentName}',
  props: {
    size: { type: [Number, String], default: 24 },
    class: String,
    style: [Object, String],
  },
  setup(props, { attrs }) {
    return () => {
      const { size = 24, class: className, style } = props
      const sizeValue = typeof size === 'number' ? \`\${size}px\` : size
      
      return h('svg', {
        width: sizeValue,
        height: sizeValue,
        viewBox: '${viewBox}',
        class: className,
        style,
        ...attrs,
      }, [h('g', { innerHTML: \`${content}\` })])
    }
  },
})

export default ${componentName}
`
}

// 生成索引文件
async function generateIndexFiles(icons: any[]) {
  const componentNames = icons.map(icon =>
    icon.name.replace(/[-_](.)/g, (_, char) => char.toUpperCase()).replace(/^(.)/, char => char.toUpperCase()),
  )

  // 使用原始图标名称作为文件名（保留连字符和下划线）
  const fileName = (name: string) => name

  // React 索引
  const reactIndex = `// Auto-generated at build time
${componentNames.map((name, index) => `import { ${name} } from './${fileName(icons[index].name)}'`).join('\n')}

export {
${componentNames.map(name => `  ${name}`).join(',\n')}
}

export const Icons = {
${componentNames.map(name => `  ${name}`).join(',\n')}
}

export const IconNames = [
${componentNames.map(name => `  '${name}'`).join(',\n')}
] as const

export type IconName = typeof IconNames[number]
`

  // Vue 索引
  const vueIndex = `// Auto-generated at build time
${componentNames.map((name, index) => `import { ${name} } from './${fileName(icons[index].name)}'`).join('\n')}

export {
${componentNames.map(name => `  ${name}`).join(',\n')}
}

export const IconNames = [
${componentNames.map(name => `  '${name}'`).join(',\n')}
] as const

export type IconName = typeof IconNames[number]
`

  await writeFile('src/react/icons/index.ts', reactIndex)
  await writeFile('src/vue/icons/index.ts', vueIndex)
}

// ==================== 插件函数 ====================

// 图标生成插件
export function iconGeneratorPlugin() {
  return {
    name: 'icon-generator',
    async buildStart() {
      await generateAllIcons()
    },
  }
}

// 清理插件
export function cleanupPlugin() {
  return {
    name: 'cleanup-after-dts',
    closeBundle() {
      cleanupGeneratedIcons()
    },
  }
}

// 可视化分析插件
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
