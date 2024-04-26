<template>
  <root-portal v-if="show">
    <page-container
      :show="props.visible"
      :z-index="props.zIndex"
      :custom-style="props.customStyle"
      :overlay="props.overlay"
      :position="props.position"
      @afterleave="afterLeave"
    >
      <view v-if="props.closeable" class="header">
        <text class="header-txt">{{ props.title }}</text>
        <view @click="emit('update:visible', false)"><y-icon name="y-close" :size="20" /></view>
      </view>
      <view class="container">
        <slot />
      </view>
    </page-container>
  </root-portal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  interface Props {
    visible: boolean
    zIndex: number
    overlay?: boolean
    position?: 'top' | 'bottom' | 'right' | 'center'
    title: string
    closeable?: boolean
    customStyle?: any
  }
  const emit = defineEmits(['update:visible', 'mounted'])
  const props = withDefaults(defineProps<Props>(), {
    customStyle: 'border-radius:8px',
    overlay: true,
    position: 'bottom',
    zIndex: 998,
    title: '标题',
    closeable: false,
  })
  const show = ref(false)

  watch(
    () => props.visible,
    (visible) => {
      visible && (show.value = true)
    }
  )

  const afterLeave = () => {
    emit('update:visible', false)
    show.value = false
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
