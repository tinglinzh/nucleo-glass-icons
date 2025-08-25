import type { IconComponent, IconData, IconProps } from '../types'
import React from 'react'
import { getSvgAttributes } from '../types'

/**
 * Create a React icon component factory
 */
export function createReactIconFactory() {
  return function createIcon(iconData: IconData): IconComponent {
    const IconComponent: React.ComponentType<IconProps> = (props: IconProps): React.ReactElement => {
      const svgProps = getSvgAttributes(iconData, props)

      return React.createElement(
        'svg',
        svgProps,
        React.createElement('g', { dangerouslySetInnerHTML: { __html: iconData.content } }),
      )
    }

    IconComponent.displayName = `Icon${iconData.name}`

    return IconComponent
  }
}

/**
 * Create a React icon component from icon data
 */
export function createIcon(iconData: IconData): IconComponent {
  const IconComponent: React.ComponentType<IconProps> = (props: IconProps): React.ReactElement => {
    const svgProps = getSvgAttributes(iconData, props)

    return React.createElement(
      'svg',
      svgProps,
      React.createElement('g', { dangerouslySetInnerHTML: { __html: iconData.content } }),
    )
  }

  IconComponent.displayName = `Icon${iconData.name}`

  return IconComponent
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

// Re-export all icon components
// @ts-expect-error clear error
export * from './icons'
