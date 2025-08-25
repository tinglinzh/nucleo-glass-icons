#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const packagePath = join(process.cwd(), 'package.json')
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
const currentVersion = packageJson.version

console.log(`🚀 Current version: ${currentVersion}`)

// 获取版本类型参数
const versionType = process.argv[2] || 'patch'
const validTypes = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch']

if (!validTypes.includes(versionType)) {
  console.error(`❌ Invalid version type: ${versionType}`)
  console.log(`Valid types: ${validTypes.join(', ')}`)
  process.exit(1)
}

try {
  console.log(`📦 Building project...`)
  execSync('pnpm run build', { stdio: 'inherit' })

  console.log(`🧪 Running type check...`)
  execSync('pnpm run typecheck', { stdio: 'inherit' })

  console.log(`🔍 Running linting...`)
  execSync('pnpm run lint', { stdio: 'inherit' })

  console.log(`📝 Bumping version to ${versionType}...`)
  execSync(`pnpm run bumpp -- ${versionType}`, { stdio: 'inherit' })

  console.log(`📤 Publishing to npm...`)
  execSync('pnpm publish --access public --no-git-checks', { stdio: 'inherit' })

  console.log(`✅ Release completed successfully!`)
}
catch (error) {
  console.error(`❌ Release failed: ${error.message}`)
  process.exit(1)
}
