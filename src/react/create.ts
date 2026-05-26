import type { IconComponent, IconData, IconProps } from '../types'
import React from 'react'
import { getSvgAttributes, nextLocalUid, transformContent } from '../types'

// Feature-detect React.useId (React 18+). On older versions we fall back to a
// module-scoped counter captured once per instance via useState. The hook is
// picked once at module load so hook order stays stable across renders.
const _useId: (() => string) | undefined = (React as any).useId
const useUniquePrefix: () => string = _useId
  ? () => `g${_useId!().replace(/:/g, '')}-`
  : () => React.useState(() => `g${nextLocalUid()}-`)[0]

/**
 * Create a memoized, ref-forwarding React icon component from icon data.
 *
 * Every render gets a stable per-instance ID prefix so multiple icons on the
 * same page never share an `#a` defs entry. The color override + prefix work
 * is memoized on its inputs to keep the common-case render allocation-free.
 */
export function createIcon(iconData: IconData): IconComponent {
  const Component = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { stopColor1, stopColor2 } = props
    const idPrefix = useUniquePrefix()
    const innerHTML = React.useMemo(
      () => ({ __html: transformContent(iconData.content, stopColor1, stopColor2, idPrefix) }),
      [stopColor1, stopColor2, idPrefix],
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
