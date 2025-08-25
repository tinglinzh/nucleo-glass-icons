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
   * First stop color for gradients (replaces #575757)
   * @default '#575757'
   */
  stopColor1?: string

  /**
   * Second stop color for gradients (replaces #151515)
   * @default '#151515'
   */
  stopColor2?: string

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

export function normalizeIconProps(props: IconProps = {}): Required<Pick<IconProps, 'size' | 'stopColor1' | 'stopColor2'>> & IconProps {
  const { size = 24, stopColor1 = '#575757', stopColor2 = '#151515', ...rest } = props

  return {
    size,
    stopColor1,
    stopColor2,
    ...rest,
  }
}

export function getSvgAttributes(iconData: IconData, props: IconProps): Record<string, any> {
  const { size, className, style, stopColor1, stopColor2, ...rest } = normalizeIconProps(props)

  const sizeValue = typeof size === 'number' ? `${size}px` : size

  return {
    width: sizeValue,
    height: sizeValue,
    viewBox: iconData.viewBox,
    className,
    style,
    stopColor1,
    stopColor2,
    ...rest,
  }
}
