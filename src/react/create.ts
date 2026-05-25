import type { IconComponent, IconData, IconProps } from '../types'
import React from 'react'
import { applyStopColors, getSvgAttributes } from '../types'

/**
 * Create a memoized, ref-forwarding React icon component from icon data.
 *
 * The color override path is short-circuited inside `applyStopColors` when both
 * colors equal the defaults, so the common-case render is allocation-free.
 */
export function createIcon(iconData: IconData): IconComponent {
  const Component = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { stopColor1, stopColor2 } = props
    const innerHTML = React.useMemo(
      () => ({ __html: applyStopColors(iconData.content, stopColor1, stopColor2) }),
      [stopColor1, stopColor2],
    )
    const svgProps = getSvgAttributes(iconData, props)

    return React.createElement(
      'svg',
      { ...svgProps, ref },
      React.createElement('g', { dangerouslySetInnerHTML: innerHTML }),
    )
  })

  Component.displayName = `Icon${iconData.name}`
  const Memoized = React.memo(Component) as unknown as IconComponent
  Memoized.displayName = Component.displayName
  return Memoized
}

/** Backwards-compatible alias. */
export const createReactIconFactory = () => createIcon

/**
 * Generic Icon component that can render any icon by data.
 */
export const Icon: React.FC<IconProps & { data: IconData }> = ({ data, ...props }) => {
  const Component = React.useMemo(() => createIcon(data), [data])
  return React.createElement(Component, props)
}
