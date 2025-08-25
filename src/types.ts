import type { ComponentType, CSSProperties } from 'react'

export interface IconProps {
  /**
   * Icon size (width and height)
   * @default 24
   */
  size?: number | string

  /**
   * Additional CSS class names (React: className, Vue: class)
   */
  className?: string

  /**
   * Inline styles
   */
  style?: CSSProperties | Record<string, any> | string

  /**
   * Additional SVG attributes
   */
  [key: string]: any
}

export type IconComponent = ComponentType<IconProps> & {
  displayName?: string
}

export interface IconData {
  name: string
  content: string
  viewBox?: string
  width?: number
  height?: number
}

export type IconRegistry = Record<string, IconData>

// Utility functions for icon data and props
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

export function normalizeIconProps(props: IconProps = {}): Required<Pick<IconProps, 'size'>> & IconProps {
  const { size = 24, ...rest } = props

  return {
    size,
    ...rest,
  }
}

export function getSvgAttributes(iconData: IconData, props: IconProps): Record<string, any> {
  const { size, className, style, ...rest } = normalizeIconProps(props)

  const sizeValue = typeof size === 'number' ? `${size}px` : size

  return {
    width: sizeValue,
    height: sizeValue,
    viewBox: iconData.viewBox,
    className,
    style,
    ...rest,
  }
}
