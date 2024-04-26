<template>
  <view
    :class="[
      prefix,
      `${prefix}-size-${size}`,
      `${prefix}-theme-${theme}`,
      `${prefix}-type-${type}`,
      { [`${prefix}-disabled`]: disabled },
      className,
    ]"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script lang="ts">
  import { toRefs } from 'vue'
  import { buttonProps } from './common'

  export default {
    name: 'YPButton',
    props: buttonProps,
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
        prefix: 'yp-button',
      }
    },
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
