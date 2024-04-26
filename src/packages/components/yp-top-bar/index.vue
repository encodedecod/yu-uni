<template>
  <view>
    <view
      :class="prefix"
      :style="{ height: `${navigatorBottom}px`, backgroundColor: props.backgroundColor, ...props.innerStyle }"
    >
      <view :style="{ height: `${navigatorHeight}px`, marginBottom: '8px' }" :class="`${prefix}-title-box`">
        <view v-if="!props.backDisable" :class="`${prefix}-back`" @click="handleBack">
          <slot v-if="$slots.default" />
          <yp-icon v-else :name="props.backName" :size="24" :color="props.color" />
        </view>
        <view :class="`${prefix}-title`" :style="{ color: props.color }">{{ props.title }}</view>
      </view>
    </view>
    <view
      v-show="props.isBlockTop"
      :style="{ height: `${navigatorBottom}px`, backgroundColor: props.backgroundColor }"
    />
  </view>
</template>

<script lang="ts" setup>
  import { IconType } from '../yp-icon/type'
  import { COLOR } from '../../../config'
  import type { CSSProperties } from 'vue'

  interface Props {
    title?: string
    backName?: IconType
    backgroundColor?: string
    color?: string
    isBlockTop?: boolean
    backDisable?: boolean
    hasBack?: boolean
    innerStyle?: CSSProperties
  }
  const system = uni.getMenuButtonBoundingClientRect()
  const navigatorBottom = system.bottom + 8
  const navigatorHeight = system.height

  const prefix = 'yp-top-bar'
  const emits = defineEmits(['back'])
  const props = withDefaults(defineProps<Props>(), {
    backName: 'y-back',
    title: '',
    backgroundColor: COLOR.whiteColor,
    isBlockTop: true,
    color: COLOR.black85Color,
    hasBack: false,
    innerStyle: undefined,
  })
  const handleBack = () => {
    emits('back')
    !props?.hasBack && uni.navigateBack()
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
