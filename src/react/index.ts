import type { IconComponent, IconData, IconProps } from '../types'
import React from 'react'
import { createReactIconFactory } from '../core'

// React-specific icon factory
const createReactIcon = createReactIconFactory(React.createElement)

/**
 * Create a React icon component from icon data
 */
export function createIcon(iconData: IconData): IconComponent {
  return createReactIcon(iconData)
}

/**
 * Generic Icon component that can render any icon by data
 */
export const Icon: React.FC<IconProps & { data: IconData }> = ({ data, ...props }) => {
  const IconComponent = createIcon(data)
  return React.createElement(IconComponent, props)
}

// Re-export types for convenience
export type { IconComponent, IconData, IconProps } from '../types'
