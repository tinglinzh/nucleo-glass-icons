import type { IconComponent, IconData, IconProps } from './types'

/**
 * Create a normalized icon data object
 */
export function createIconData(
  name: string,
  content: string,
  viewBox = '0 0 24 24',
  width = 24,
  height = 24,
): IconData {
  return {
    name,
    content,
    viewBox,
    width,
    height,
  }
}

/**
 * Normalize icon props with defaults
 */
export function normalizeIconProps(props: IconProps = {}): Required<Pick<IconProps, 'size' | 'color'>> & IconProps {
  const { size = 24, color = 'currentColor', ...rest } = props

  return {
    size,
    color,
    ...rest,
  }
}

/**
 * Generate SVG attributes from icon data and props
 */
export function getSvgAttributes(iconData: IconData, props: IconProps): Record<string, any> {
  const { size, color, className, style, ...rest } = normalizeIconProps(props)

  const sizeValue = typeof size === 'number' ? `${size}px` : size

  return {
    width: sizeValue,
    height: sizeValue,
    viewBox: iconData.viewBox,
    fill: color,
    className,
    style,
    ...rest,
  }
}

/**
 * Create an icon component factory for React
 */
export function createReactIconFactory<T = any>(
  createElement: (tag: string, props: any, children?: any) => T,
) {
  return function createIcon(iconData: IconData): IconComponent {
    const IconComponent = (props: IconProps): T => {
      const svgProps = getSvgAttributes(iconData, props)

      return createElement(
        'svg',
        svgProps,
        createElement('g', { dangerouslySetInnerHTML: { __html: iconData.content } }),
      )
    }

    IconComponent.displayName = `Icon${iconData.name}`

    return IconComponent
  }
}

/**
 * Create an icon component factory for Vue
 */
export function createVueIconFactory<T = any>(
  createElement: (tag: string, props: any, children?: any) => T,
) {
  return function createIcon(iconData: IconData): IconComponent {
    const IconComponent = (props: IconProps): T => {
      const svgProps = getSvgAttributes(iconData, props)

      return createElement(
        'svg',
        svgProps,
        [createElement('g', { innerHTML: iconData.content })],
      )
    }

    IconComponent.displayName = `Icon${iconData.name}`

    return IconComponent
  }
}
