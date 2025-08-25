import type { IconComponent, IconData } from '../types'
import { defineComponent, h } from 'vue'
import { getSvgAttributes } from '../types'

/**
 * Create a Vue icon component from icon data
 */
export function createIcon(iconData: IconData): IconComponent {
  const IconComponent = defineComponent({
    name: `Icon${iconData.name}`,
    props: {
      size: {
        type: [Number, String],
        default: 24,
      },
      color: {
        type: String,
        default: 'currentColor',
      },
      className: String,
      style: [Object, String],
    },
    setup(props, { attrs }) {
      return () => {
        const iconProps = { ...props, ...attrs }
        const svgProps = getSvgAttributes(iconData, iconProps as any)

        return h('svg', svgProps, [
          h('g', {
            innerHTML: iconData.content,
          }),
        ])
      }
    },
  })

  return IconComponent as any
}

/**
 * Generic Icon component that can render any icon by data
 */
export const Icon = defineComponent({
  name: 'Icon',
  props: {
    data: {
      type: Object as () => IconData,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 24,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    className: String,
    style: [Object, String],
  },
  setup(props, { attrs }) {
    return () => {
      const IconComponent = createIcon(props.data)
      const componentProps = { ...props, ...attrs }
      return h(IconComponent, componentProps as any)
    }
  },
})

// Re-export types for convenience
export type { IconComponent, IconData, IconProps } from '../types'
