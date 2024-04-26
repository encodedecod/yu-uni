<template>
  <view :class="[`${prefix}-container`, { [`${prefix}-show`]: show }]" @touchmove.stop.prevent>
    <view v-if="isMask" :class="[`${prefix}-mask`, { [`${prefix}-mask-show`]: show }]" @tap="handleCloseMask" />
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
        <view v-if="title" :class="`${prefix}-title`">
          {{ title }}
        </view>
        <view v-if="isShowClose" :class="`${prefix}-close-box`" @click="handleCancel">
          <yp-icon :color="COLOR.black45Color" name="y-close" :size="20" :class="`${prefix}-close`" />
        </view>

        <view :class="`${prefix}-content`">
          <template v-if="$slots.content">
            <slot name="content" />
          </template>
          <template v-else>
            <text :class="`${prefix}-text`">
              {{ content }}
            </text>
          </template>
        </view>
        <view :class="`${prefix}-btn`">
          <yp-button
            v-show="type === 'double'"
            theme="default"
            :class="`${prefix}-btn-item`"
            type="flex"
            @click="handleCancel"
          >
            <text :class="`${prefix}-cancel-text`">
              {{ cancelText }}
            </text>
          </yp-button>
          <yp-button :class="`${prefix}-btn-item`" type="flex" @click="handleConfirm">
            <text :class="`${prefix}-confirm-text`">
              {{ confirmText }}
            </text>
          </yp-button>
        </view>
      </template>
    </view>
  </view>
</template>

<script lang="ts">
  import { dialogProps } from './common'
  import { ref, toRefs } from 'vue'
  import { COLOR } from '../../../config'
  export default {
    name: 'YPDialog',
    props: dialogProps,
    emits: ['confirm', 'cancel'],
    setup(props, { emit }) {
      const { maskClosable } = toRefs(props)
      const show = ref(false)
      const handleConfirm = () => {
        if (!show.value) return
        emit('confirm')
      }
      const handleCancel = () => {
        emit('cancel')
      }

      const handleCloseMask = () => {
        if (!maskClosable.value) return
        emit('cancel')
      }
      const open = () => {
        show.value = true
      }
      const close = () => {
        show.value = false
      }
      return {
        handleConfirm,
        handleCancel,
        handleCloseMask,
        prefix: 'yp-dialog',
        show,
        open,
        close,
        COLOR,
      }
    },
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
