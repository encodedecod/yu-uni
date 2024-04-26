<!--
 * @Date: 2023-08-09 10:52:28
 * @Description: Icon
-->
<template>
  <view
    :class="['iconfont', name, className]"
    :style="{
      color,
      fontSize,
      fontWeight: bold ? 'bold' : 'normal',
      ...customStyle,
    }"
    @click="handleClick"
  />
</template>

<script lang="ts">
  import { toRefs } from 'vue'
  import { pxToRpx } from '../../shared/utils'
  import { buttonProps } from './common'

  export default {
    name: 'YPIcon',
    props: buttonProps,
    setup(props, { emit }) {
      const { size } = toRefs(props)
      const handleClick = (event: MouseEvent) => {
        emit('click', event)
      }
      return {
        fontSize: pxToRpx(size.value),
        handleClick,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
