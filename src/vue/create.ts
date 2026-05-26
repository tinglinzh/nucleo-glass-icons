import type { IconComponent, IconData } from '../types'
import * as Vue from 'vue'
import { computed, defineComponent, h } from 'vue'
import { DEFAULT_STOP_COLOR_1, DEFAULT_STOP_COLOR_2, getSvgAttributes, nextLocalUid, transformContent } from '../types'

// Feature-detect Vue's `useId` (Vue 3.5+). Falls back to a module-scoped
// counter captured once in setup() so hydration is consistent for client-only
// rendering. SSR users on Vue <3.5 should upgrade for hydration-safe IDs.
const _useId: (() => string) | undefined = (Vue as any).useId
function useUniquePrefix(): string {
  if (_useId) {
    return `g${_useId().replace(/:/g, '')}-`
  }
  return `g${nextLocalUid()}-`
}

/**
 * Create a Vue icon component from icon data.
 *
 * Each component instance gets a stable per-instance ID prefix so multiple
 * icons on the same page never share an `#a` defs entry.
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
      const idPrefix = useUniquePrefix()
      const innerHtml = computed(() =>
        transformContent(iconData.content, props.stopColor1, props.stopColor2, idPrefix),
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
    const idPrefix = useUniquePrefix()
    const innerHtml = computed(() =>
      transformContent(props.data.content, props.stopColor1, props.stopColor2, idPrefix),
    )
    return () => {
      const svgProps = getSvgAttributes(props.data, { ...props, ...attrs } as any)
      return h('svg', svgProps, [h('g', { innerHTML: innerHtml.value })])
    }
  },
})
