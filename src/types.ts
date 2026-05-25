type CSSProperties = Record<string, string | number | undefined>

export const DEFAULT_STOP_COLOR_1 = '#575757'
export const DEFAULT_STOP_COLOR_2 = '#151515'

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

export type IconComponent<P = IconProps> = ((props: P) => any) & {
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

export function createIconData(
  name: string,
  content: string,
  viewBox = '0 0 24 24',
  width = 24,
  height = 24,
): IconData {
  return { name, content, viewBox, width, height }
}

/**
 * Apply stop-color overrides to raw SVG content.
 * Short-circuits when both colors equal the defaults so we skip allocations
 * on the hot path (the common case where the user never customizes colors).
 */
export function applyStopColors(
  content: string,
  stopColor1: string = DEFAULT_STOP_COLOR_1,
  stopColor2: string = DEFAULT_STOP_COLOR_2,
): string {
  if (stopColor1 === DEFAULT_STOP_COLOR_1 && stopColor2 === DEFAULT_STOP_COLOR_2) {
    return content
  }
  let out = content
  if (stopColor1 !== DEFAULT_STOP_COLOR_1) {
    out = out.split(`stop-color="${DEFAULT_STOP_COLOR_1}"`).join(`stop-color="${stopColor1}"`)
  }
  if (stopColor2 !== DEFAULT_STOP_COLOR_2) {
    out = out.split(`stop-color="${DEFAULT_STOP_COLOR_2}"`).join(`stop-color="${stopColor2}"`)
  }
  return out
}

/**
 * Build the final attribute bag for the root <svg>.
 * NOTE: stopColor1/stopColor2 are intentionally consumed here, not forwarded.
 */
export function getSvgAttributes(iconData: IconData, props: IconProps): Record<string, any> {
  const {
    size = 24,
    className,
    style,
    stopColor1: _s1,
    stopColor2: _s2,
    ...rest
  } = props

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
