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
 * Prefix every `id="X"` and `url(#X)` reference inside the SVG content with a
 * unique value so multiple icon instances on the same page don't collide on
 * short minified IDs (a, b, c, ...). Without this, the browser resolves every
 * `url(#a)` to the first `#a` in document order across all rendered icons.
 */
export function applyIdPrefix(content: string, prefix: string): string {
  if (!prefix) {
    return content
  }
  return content
    .replace(/id="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`)
}

/**
 * Combined transform: stop-color overrides + per-instance ID namespacing.
 */
export function transformContent(
  content: string,
  stopColor1: string | undefined,
  stopColor2: string | undefined,
  idPrefix: string,
): string {
  return applyIdPrefix(applyStopColors(content, stopColor1, stopColor2), idPrefix)
}

let _localUidCounter = 0
/**
 * Monotonically increasing base36 suffix. Used as a fallback when the host
 * framework does not provide an SSR-safe `useId` primitive (React <18,
 * Vue <3.5). For client-only rendering this is sufficient; SSR users on
 * older versions should upgrade to get hydration-safe IDs.
 */
export function nextLocalUid(): string {
  _localUidCounter = (_localUidCounter + 1) | 0
  return _localUidCounter.toString(36)
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
