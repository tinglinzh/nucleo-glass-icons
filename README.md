## Icon Library

[**中文文档**](https://github.com/tinglinzh/nucleo-glass-icons/blob/main/README.zh-CN.md)

This package wraps the open-source **SVG Glass Icons** provided by [Nucleoapp](https://nucleoapp.com/svg-glass-icons), making it easy to use these icons directly in your projects.

All icons come from [Nucleoapp](https://nucleoapp.com/svg-glass-icons). You can also copy and paste the SVG code from the official website if needed.

### Features

- 🌳 **Tree-shakable** – Only the icons you use will be included in your bundle
- ⚛️ **Multi-framework support** – Works with both React and Vue
- 📦 **Dynamic imports** – Avoid bundling all icons at once
- 🎯 **TypeScript-ready** – Full type definitions and IntelliSense support
- 🔧 **Flexible styling** – Supports custom sizes and class names
- 🎨 **Gradient colors** – Customize gradient stop colors

### Installation

```bash
npm install nucleo-glass-icons
# or
pnpm add nucleo-glass-icons
# or
yarn add nucleo-glass-icons
```

### Usage

#### React

```tsx
import { AppStack } from 'nucleo-glass-icons/react'
import React from 'react'

function App() {
  return (
    <div>
      {/* Basic usage */}
      <AppStack />

      {/* Custom size */}
      <AppStack size={32} />

      {/* Using className */}
      <AppStack className="my-icon" />

      {/* Inline styles */}
      <AppStack style={{ margin: '10px' }} />

      {/* Custom gradient colors */}
      <AppStack stopColor1="#3b82f6" stopColor2="#1e40af" />

      {/* Combination usage */}
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
    <!-- Basic usage -->
    <AppStack />

    <!-- Custom size -->
    <AppStack :size="32" />

    <!-- Using class -->
    <AppStack class="my-icon" />

    <!-- Inline styles -->
    <AppStack :style="{ margin: '10px' }" />

    <!-- Custom gradient colors -->
    <AppStack stop-color1="#3b82f6" stop-color2="#1e40af" />

    <!-- Combination usage -->
    <AppStack
      :size="48"
      class="custom-icon"
      stop-color1="#ef4444"
      stop-color2="#dc2626"
    />
  </div>
</template>
```

#### Bulk Import

```tsx
// React
import { IconNames, Icons } from 'nucleo-glass-icons/react'

// Vue
import { IconNames, Icons } from 'nucleo-glass-icons/vue'

// All icons
console.log(Icons) // [Component, ... }

// All icon names
console.log(IconNames) // ['AppStack', ... ]
```

### Props

#### React Component

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | Icon width and height |
| `className` | `string` | - | CSS class name |
| `style` | `React.CSSProperties \| Record<string, any> \| string` | - | Inline styles |
| `stopColor1` | `string` | `'#575757'` | First gradient stop color (replaces #575757) |
| `stopColor2` | `string` | `'#151515'` | Second gradient stop color (replaces #151515) |

#### Vue Component

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | Icon width and height |
| `class` | `string` | - | CSS class |
| `style` | `object \| string` | - | Inline styles |
| `stopColor1` | `string` | `'#575757'` | First gradient stop color (replaces #575757) |
| `stopColor2` | `string` | `'#151515'` | Second gradient stop color (replaces #151515) |

### 渐变颜色说明

All gradient colors in an icon are automatically replaced:

- `stop-color="#575757"` → `stopColor1`
- `stop-color="#151515"` → `stopColor2`

**Example:**
```tsx
// Original SVG gradient
<linearGradient id="1752500502790-2257412_heart_existing_0_ik394vb0b" x1="8.505" y1="3" x2="8.505" y2="21.733" gradientUnits="userSpaceOnUse">
  <stop stop-color="#575757"></stop>
  <stop offset="1" stop-color="#151515"></stop>
</linearGradient>
```

```tsx
// Using custom colors
<AppStack stopColor1="#3b82f6" stopColor2="#1e40af" />
// Results in:
// <stop stop-color="#3b82f6"></stop>
// <stop offset="1" stop-color="#1e40af"></stop>
```

**Note:** A single SVG may contain multiple stops with the same color; all will be replaced accordingly.

### Development

#### Build

```bash
# Recommended build using Rolldown
pnpm run build
```

The build process automatically:
1. Reads icon data from public/icons/index.json
2. Generates React and Vue components
3. Packages all artifacts
4. Cleans up temporary files

#### Bundle Analysis

构建完成后，可以查看可视化的包分析报告：

```bash
# View all reports
pnpm run stats

# React entry analysis (sunburst view)
pnpm run stats:react

# Vue entry analysis (network view)
pnpm run stats:vue

# Build and view report
pnpm run analyze
```

#### Development Mode

```bash
# Watch mode
pnpm run dev
```

### Tech Stack

- **Build Tool**: Rolldown
- **Bundle Analysis**: rollup-plugin-visualizer
- **SVG Optimization**: SVGO
- **DOM Parsing**: Cheerio
- **Type Checking**: TypeScript

### License

MIT
