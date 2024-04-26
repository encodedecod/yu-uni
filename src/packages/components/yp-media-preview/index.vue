<!-- PreviewPage.vue -->
<template>
  <yp-page-container
    v-model:visible="visible"
    :custom-style="{ height: '100vh', backgroundColor: 'black' }"
    :class="prefix"
    :safe-distance="false"
    position="right"
    @close="close"
  >
    <view :class="prefix">
      <yp-top-bar
        v-show="currentX >= -0.3 && currentX <= 0.3"
        :color="COLOR.whiteColor"
        :is-block-top="false"
        has-back
        background-color="transparent"
        @back="close"
      >
        <yp-icon :color="COLOR.whiteColor" :custom-style="{ fontSize: '24px' }" name="y-back" />
      </yp-top-bar>
      <!-- 使用 uni-swiper 创建左右滑动效果 -->
      <swiper v-if="previewList?.length" :current="current" :class="`${prefix}-swiper`" @change="swiperChange">
        <!-- 遍历预览项 -->
        <swiper-item
          v-for="(item, index) in previewList"
          :key="item.url"
          @click="() => item.type === 'image' && close()"
        >
          <movable-area scale-area class="movable-area">
            <movable-view class="movable-view" direction="all" scale scale-min="1" scale-max="4">
              <!-- 显示图片或视频 -->
              <image v-if="item.type === 'image'" :class="`${prefix}-swiper-item`" :src="item.url" mode="aspectFit" />
              <video
                v-else
                :id="`${index}`"
                :class="`${prefix}-swiper-item`"
                controls
                :src="item.url"
                :show-fullscreen-btn="false"
                :show-center-play-btn="false"
              />
            </movable-view>
          </movable-area>
        </swiper-item>
      </swiper>
    </view>
  </yp-page-container>
</template>

<script setup lang="ts">
  import { getCurrentInstance, ref, watch } from 'vue'
  import * as config from '../../../config'
  import { sleep } from '../../shared/utils'
  const COLOR = config.COLOR
  const prefix = 'yp-media-preview'
  interface Props {
    previewList: { type: 'image' | 'video'; url: string }[]
    currentIndex: number
  }

  const currentX = ref(0)
  const previewList = ref<{ type: 'image' | 'video'; url: string }[]>([])
  const accelerometerChange = (res: UniApp.OnAccelerometerChangeSuccess) => {
    // 根据重力感应数据调整视频的全屏方向
    if (res.x < -0.3 && currentX.value >= -0.3) {
      currentX.value = res.x
      const videoContext = uni.createVideoContext(`${current.value}`, instance)
      videoContext.requestFullScreen({ direction: 90 })
      return
    }
    if (res.x > 0.3 && currentX.value <= 0.3) {
      currentX.value = res.x
      const videoContext = uni.createVideoContext(`${current.value}`, instance)
      videoContext.requestFullScreen({ direction: -90 })
      return
    }

    if (res.x >= -0.3 && res.x <= 0.3 && (currentX.value <= -0.3 || currentX.value > 0.3)) {
      currentX.value = res.x
      const videoContext = uni.createVideoContext(`${current.value}`, instance)
      videoContext.exitFullScreen()
      return
    }
  }
  const instance = getCurrentInstance()
  const visible = ref(false)
  const current = ref(0)
  const open = async (info: Props) => {
    current.value = info.currentIndex
    previewList.value = info.previewList
    visible.value = true
    if (info.previewList[info.currentIndex].type === 'video') {
      uni.showLoading()
      await sleep(600)
      uni.hideLoading()
      const videoContext = uni.createVideoContext(`${info.currentIndex}`, instance)
      videoContext.play()
    }
    uni.onAccelerometerChange(accelerometerChange)
  }
  const close = () => {
    visible.value = false
  }
  const swiperChange = (e: { detail: { current: number } }) => {
    if (previewList.value[current.value].type === 'video' && e.detail.current !== current.value) {
      const videoContext = uni.createVideoContext(`${current.value}`, instance)
      videoContext.pause()
    }
    current.value = e.detail.current
  }
  watch(
    () => visible.value,
    () => {
      if (!visible.value) {
        const videoContext = uni.createVideoContext(`${current.value}`, instance)
        currentX.value = 0
        current.value = 0
        previewList.value = []
        videoContext.exitFullScreen()
        uni.offAccelerometerChange(accelerometerChange)
      }
    }
  )
  defineExpose({ open, close })
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
