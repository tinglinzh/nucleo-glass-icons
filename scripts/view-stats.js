#!/usr/bin/env node

import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const statsFiles = [
  { name: 'Main Bundle', file: 'dist/stats-main.html' },
  { name: 'React Bundle', file: 'dist/stats-react.html' },
  { name: 'Vue Bundle', file: 'dist/stats-vue.html' },
]

console.log('📊 Available bundle analysis reports:')
console.log('')

statsFiles.forEach((stat, index) => {
  const exists = existsSync(stat.file)
  const status = exists ? '✅' : '❌'
  console.log(`${index + 1}. ${status} ${stat.name} - ${stat.file}`)
})

console.log('')

if (process.argv[2]) {
  const choice = Number.parseInt(process.argv[2])
  if (choice >= 1 && choice <= statsFiles.length) {
    const selectedStat = statsFiles[choice - 1]
    if (existsSync(selectedStat.file)) {
      console.log(`🚀 Opening ${selectedStat.name}...`)
      const fullPath = join(process.cwd(), selectedStat.file)

      // 根据操作系统选择打开命令
      const command = process.platform === 'win32'
        ? `start "" "${fullPath}"`
        : process.platform === 'darwin'
          ? `open "${fullPath}"`
          : `xdg-open "${fullPath}"`

      exec(command, (error) => {
        if (error) {
          console.error(`❌ Failed to open file: ${error.message}`)
        }
        else {
          console.log(`✅ Opened ${selectedStat.name} in your default browser`)
        }
      })
    }
    else {
      console.log(`❌ File not found: ${selectedStat.file}`)
    }
  }
  else {
    console.log('❌ Invalid choice. Please select 1, 2, or 3.')
  }
}
else {
  console.log('Usage:')
  console.log('  node scripts/view-stats.js [1|2|3]')
  console.log('')
  console.log('Examples:')
  console.log('  node scripts/view-stats.js 1  # Open main bundle stats')
  console.log('  node scripts/view-stats.js 2  # Open React bundle stats')
  console.log('  node scripts/view-stats.js 3  # Open Vue bundle stats')
}
