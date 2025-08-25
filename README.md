# Icon Library

本组件基于 [Nucleoapp](https://nucleoapp.com/svg-glass-icons) 提供的开源 **SVG Glass Icons** 封装而成，旨在方便在项目中直接使用这些图标。

所有图标均来自 [Nucleoapp](https://nucleoapp.com/svg-glass-icons)，你也可以前往其官方网站复制并粘贴 SVG 代码进行使用。

## 特性

- 🌳 **Tree-shaking 友好** - 只打包你使用的图标
- ⚛️ **多框架支持** - 支持 React 和 Vue
- 📦 **动态导入** - 避免一次性打包所有图标
- 🎯 **TypeScript 支持** - 完整的类型定义和智能提示
- 🔧 **灵活样式** - 支持自定义大小、颜色、className

## 安装

```bash
npm install nucleo-glass-icons
# 或
pnpm add nucleo-glass-icons
# 或
yarn add nucleo-glass-icons
```

## 使用方法

### React

```tsx
import { AppStack } from 'nucleo-glass-icons/react'
import React from 'react'

function App() {
  return (
    <div>
      {/* 基本使用 */}
      <AppStack />

      {/* 自定义大小和颜色 */}
      <AppStack size={32} color="#3b82f6" />

      {/* 使用 className */}
      <AppStack className="my-icon" />

      {/* 内联样式 */}
      <AppStack style={{ margin: '10px' }} />
    </div>
  )
}
```

### Vue

```vue
<script setup>
import { AppStack } from 'nucleo-glass-icons/vue'
</script>

<template>
  <div>
    <!-- 基本使用 -->
    <AppStack />

    <!-- 自定义大小和颜色 -->
    <AppStack :size="32" color="#3b82f6" />

    <!-- 使用 className -->
    <AppStack class-name="my-icon" />

    <!-- 内联样式 -->
    <AppStack :style="{ margin: '10px' }" />
  </div>
</template>
```

### 动态导入

#### React

```tsx
import { AppStackData } from 'nucleo-glass-icons'
import { Icon } from 'nucleo-glass-icons/react'

function DynamicIcon() {
  return <Icon data={AppStackData} size={24} />
}
```

#### Vue

```vue
<script setup>
import { AppStackData } from 'nucleo-glass-icons'
import { Icon } from 'nucleo-glass-icons/vue'
</script>

<template>
  <Icon :data="AppStackData" :size="24" />
</template>
```

### 批量导入

```tsx
// React
import { IconNames, Icons } from 'nucleo-glass-icons/react'

// Vue
import { IconNames, Icons } from 'nucleo-glass-icons/vue'

// 所有图标
console.log(Icons) // { AppStack: Component, ... }

// 所有图标名称
console.log(IconNames) // ['AppStack', ...]
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | 图标大小（宽度和高度） |
| `color` | `string` | `'currentColor'` | 图标颜色 |
| `className` | `string` | - | CSS 类名 |
| `style` | `React.CSSProperties \| Record<string, any> \| string` | - | 内联样式 |

## 开发

### 添加新图标

1. 将 SVG 文件放入 `/public/icons/` 目录
2. 运行生成脚本：

```bash
pnpm run generate
```

### 构建

```bash
# 使用 Rolldown 构建（推荐）
pnpm run build

```

### 包分析

构建完成后，可以查看可视化的包分析报告：

```bash
# 查看所有可用报告
pnpm run stats

# 直接打开主入口分析报告（treemap 视图）
pnpm run stats:main

# 直接打开 React 入口分析报告（sunburst 视图）
pnpm run stats:react

# 直接打开 Vue 入口分析报告（network 视图）
pnpm run stats:vue

# 构建并查看分析报告
pnpm run analyze
```

### 开发模式

```bash
# 监听模式构建
pnpm run dev
```

## 技术栈

- **构建工具**: Rolldown
- **包分析**: rollup-plugin-visualizer
- **SVG 优化**: SVGO
- **DOM 解析**: Cheerio
- **类型检查**: TypeScript

## 许可证

MIT
