import type { IconComponent, IconData } from '../types'
import { computed, defineComponent, h } from 'vue'
import { applyStopColors, DEFAULT_STOP_COLOR_1, DEFAULT_STOP_COLOR_2, getSvgAttributes } from '../types'

/**
 * Create a Vue icon component from icon data.
 */
export function createIcon(iconData: IconData): IconComponent {
  return defineComponent({
    name: `Icon${iconData.name}`,
    props: {
      size: { type: [Number, String], default: 24 },
      className: String,
      style: [Object, String],
      stopColor1: { type: String, default: DEFAULT_STOP_COLOR_1 },
      stopColor2: { type: String, default: DEFAULT_STOP_COLOR_2 },
    },
    setup(props, { attrs }) {
      const innerHtml = computed(() =>
        applyStopColors(iconData.content, props.stopColor1, props.stopColor2),
      )
      return () => {
        const svgProps = getSvgAttributes(iconData, { ...props, ...attrs } as any)
        return h('svg', svgProps, [h('g', { innerHTML: innerHtml.value })])
      }
    },
  }) as any
}

/**
 * Generic Icon component that can render any icon by data.
 */
export const Icon = defineComponent({
  name: 'Icon',
  props: {
    data: { type: Object as () => IconData, required: true },
    size: { type: [Number, String], default: 24 },
    className: String,
    style: [Object, String],
    stopColor1: { type: String, default: DEFAULT_STOP_COLOR_1 },
    stopColor2: { type: String, default: DEFAULT_STOP_COLOR_2 },
  },
  setup(props, { attrs }) {
    const innerHtml = computed(() =>
      applyStopColors(props.data.content, props.stopColor1, props.stopColor2),
    )
    return () => {
      const svgProps = getSvgAttributes(props.data, { ...props, ...attrs } as any)
      return h('svg', svgProps, [h('g', { innerHTML: innerHtml.value })])
    }
  },
})
