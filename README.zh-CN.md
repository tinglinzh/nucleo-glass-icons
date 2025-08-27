## Icon Library

本组件基于 [Nucleoapp](https://nucleoapp.com/svg-glass-icons) 提供的开源 **SVG Glass Icons** 封装而成，旨在方便在项目中直接使用这些图标。

所有图标均来自 [Nucleoapp](https://nucleoapp.com/svg-glass-icons)，你也可以前往其官方网站复制并粘贴 SVG 代码进行使用。

### 特性

- 🌳 **Tree-shaking 友好** - 只打包你使用的图标
- ⚛️ **多框架支持** - 支持 React 和 Vue
- 📦 **动态导入** - 避免一次性打包所有图标
- 🎯 **TypeScript 支持** - 完整的类型定义和智能提示
- 🔧 **灵活样式** - 支持自定义大小、类名
- 🎨 **渐变颜色** - 支持自定义渐变停止颜色

### 安装

```bash
npm install nucleo-glass-icons
# 或
pnpm add nucleo-glass-icons
# 或
yarn add nucleo-glass-icons
```

### 使用方法

#### React

```tsx
import { AppStack } from 'nucleo-glass-icons/react'
import React from 'react'

function App() {
  return (
    <div>
      {/* 基本使用 */}
      <AppStack />

      {/* 自定义大小 */}
      <AppStack size={32} />

      {/* 使用 className */}
      <AppStack className="my-icon" />

      {/* 内联样式 */}
      <AppStack style={{ margin: '10px' }} />

      {/* 自定义渐变颜色 */}
      <AppStack stopColor1="#3b82f6" stopColor2="#1e40af" />

      {/* 组合使用 */}
      <AppStack
        size={48}
        className="custom-icon"
        stopColor1="#ef4444"
        stopColor2="#dc2626"
      />
    </div>
  )
}
```

#### Vue

```vue
<script setup>
import { AppStack } from 'nucleo-glass-icons/vue'
</script>

<template>
  <div>
    <!-- 基本使用 -->
    <AppStack />

    <!-- 自定义大小 -->
    <AppStack :size="32" />

    <!-- 使用 class -->
    <AppStack class="my-icon" />

    <!-- 内联样式 -->
    <AppStack :style="{ margin: '10px' }" />

    <!-- 自定义渐变颜色 -->
    <AppStack stop-color1="#3b82f6" stop-color2="#1e40af" />

    <!-- 组合使用 -->
    <AppStack
      :size="48"
      class="custom-icon"
      stop-color1="#ef4444"
      stop-color2="#dc2626"
    />
  </div>
</template>
```

#### 批量导入

```tsx
// React
import { IconNames, Icons } from 'nucleo-glass-icons/react'

// Vue
import { IconNames, Icons } from 'nucleo-glass-icons/vue'

// 所有图标
console.log(Icons) // { AppStack: Component, ... }

// 所有图标名称
console.log(IconNames) // ['AppStack', ... ]
```

### Props

#### React 组件

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | 图标大小（宽度和高度） |
| `className` | `string` | - | CSS 类名 |
| `style` | `React.CSSProperties \| Record<string, any> \| string` | - | 内联样式 |
| `stopColor1` | `string` | `'#575757'` | 第一个渐变停止颜色（替换 #575757） |
| `stopColor2` | `string` | `'#151515'` | 第二个渐变停止颜色（替换 #151515） |

#### Vue 组件

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | 图标大小（宽度和高度） |
| `class` | `string` | - | CSS 类名 |
| `style` | `object \| string` | - | 内联样式 |
| `stopColor1` | `string` | `'#575757'` | 第一个渐变停止颜色（替换 #575757） |
| `stopColor2` | `string` | `'#151515'` | 第二个渐变停止颜色（替换 #151515） |

### 渐变颜色说明

图标中的渐变颜色会自动替换：

- `stop-color="#575757"` → 使用 `stopColor1` 的值
- `stop-color="#151515"` → 使用 `stopColor2` 的值

**示例：**
```tsx
// 原始 SVG 中的渐变
<linearGradient id="1752500502790-2257412_heart_existing_0_ik394vb0b" x1="8.505" y1="3" x2="8.505" y2="21.733" gradientUnits="userSpaceOnUse">
  <stop stop-color="#575757"></stop>
  <stop offset="1" stop-color="#151515"></stop>
</linearGradient>
```

```tsx
// 使用自定义颜色后
<AppStack stopColor1="#3b82f6" stopColor2="#1e40af" />
// 会生成：
// <stop stop-color="#3b82f6"></stop>
// <stop offset="1" stop-color="#1e40af"></stop>
```

**注意：** 一个 SVG 中可能有多个相同的 `stop-color` 值，都会被替换为对应的变量。

### 开发

#### 构建

```bash
# 使用 Rolldown 构建（推荐）
pnpm run build
```

构建过程会自动：
1. 从 `public/icons/index.json` 读取图标数据
2. 生成 React 和 Vue 图标组件
3. 打包所有构建产物
4. 自动清理临时生成的文件

#### 包分析

构建完成后，可以查看可视化的包分析报告：

```bash
# 查看所有可用报告
pnpm run stats

# 直接打开 React 入口分析报告（sunburst 视图）
pnpm run stats:react

# 直接打开 Vue 入口分析报告（network 视图）
pnpm run stats:vue

# 构建并查看分析报告
pnpm run analyze
```

#### 开发模式

```bash
# 监听模式构建
pnpm run dev
```

### 技术栈

- **构建工具**: Rolldown
- **包分析**: rollup-plugin-visualizer
- **SVG 优化**: SVGO
- **DOM 解析**: Cheerio
- **类型检查**: TypeScript

### 许可证

MIT
