export type { IconComponent, IconData, IconProps } from '../types'
export { createIcon, Icon } from './create'

// Re-export all icon components
// @ts-expect-error generated at build time
export * from './icons'
