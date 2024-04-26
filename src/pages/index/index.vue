<template>
  <view :style="{ display: 'flex', width: '100vw', paddingTop: '100px' }">
    <view :style="{ width: '50%' }">
      <YPButton type="flex" @click="open">主要按钮</YPButton>
    </view>
    <view :style="{ width: '50%' }">
      <yp-tag size="huge">标签</yp-tag>
      <yp-button @click="openToast">主要按钮</yp-button>
    </view>
    <yp-dialog ref="dialogRef" title="主题" content="内容" @cancel="handleClose" />
    <yp-toast ref="toastRef" type="notice" content="内容" />
  </view>
</template>

<script setup lang="ts">
  import YPButton from '@/packages/components/yp-button/index.vue'
  import { ref } from 'vue'
  const dialogRef = ref()
  const toastRef = ref()
  const open = () => {
    dialogRef.value.open()
  }
  const openToast = () => {
    toastRef.value.open()
  }
  const handleClose = () => {
    dialogRef.value.close()
  }
</script>

<style scoped lang="scss"></style>
