<template>
  <view :class="[prefix, `${prefix}-size-${size}`, `${prefix}-theme-${theme}`, className]" @click="handleClick">
    <slot />
  </view>
</template>

<script lang="ts">
  import { toRefs, type PropType } from 'vue'

  export type Theme = 'default' | 'primary' | 'orange'
  export type Size = 'large' | 'normal' | 'huge'
  /**
   * 超过一屏时插槽使用scroll-view
   **/
  export default {
    name: 'YPTag',
    props: {
      theme: {
        type: String as PropType<Theme>,
        default: 'default',
      },
      size: {
        type: String as PropType<Size>,
        default: 'normal',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      className: {
        type: String,
        default: '',
      },
    },
    emits: ['click'],
    setup(props, { emit }) {
      const { disabled } = toRefs(props)

      const handleClick = (event: MouseEvent) => {
        if (!disabled.value) {
          emit('click', event)
        }
      }

      return {
        handleClick,
      }
    },
    data() {
      return {
        prefix: 'yp-tag',
      }
    },
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
