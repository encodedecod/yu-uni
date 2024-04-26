<template>
  <view :class="[`${prefix}-container`, { [`${prefix}-show`]: show }]" @touchmove.stop.prevent>
    <view v-if="isMask" :class="[`${prefix}-mask`, { [`${prefix}-mask-show`]: show }]" />
    <view
      :class="[
        `${prefix}-box`,
        fadeIn || show ? `${prefix}-normal` : `${prefix}-scale`,
        { [`${prefix}-show`]: show },
        className,
      ]"
    >
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <div :class="[{ [`${prefix}-loading`]: type === 'loading' }]">
          <yp-icon
            v-show="iconName || TOAST_TYPE_MAP[type]"
            :name="iconName || TOAST_TYPE_MAP[type]"
            :size="24"
            :color="COLOR.whiteColor"
          />
        </div>
        <text :class="[`${prefix}-content`, { [`${prefix}-icon-margin`]: iconName || TOAST_TYPE_MAP[type] }]">
          {{ content }}
        </text>
      </template>
    </view>
  </view>
</template>

<script lang="ts">
  import { toastProps, TOAST_TYPE_MAP } from './common'
  import { ref, toRefs } from 'vue'
  import { COLOR } from '../../../config'
  export default {
    name: 'YPToast',
    props: toastProps,
    emits: ['confirm', 'cancel'],
    setup(props, { emit }) {
      let timer: NodeJS.Timeout | null | undefined
      const { duration, type } = toRefs(props)
      const clearTimer = () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
      const show = ref(false)
      const handleConfirm = () => {
        if (!show.value) return
        emit('confirm')
      }
      const handleCancel = () => {
        emit('cancel')
      }

      const open = () => {
        show.value = true
        if (type.value !== 'loading') {
          clearTimer()
          timer = setTimeout(() => {
            show.value = false
          }, duration.value)
        }
      }
      const close = () => {
        show.value = false
      }
      return {
        handleConfirm,
        handleCancel,
        prefix: 'yp-toast',
        show,
        open,
        close,
        COLOR,
        TOAST_TYPE_MAP,
      }
    },
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
