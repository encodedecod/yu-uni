import type { ExtractPropTypes, PropType } from 'vue'

export type DialogType = 'single' | 'double'

export const dialogProps = {
  //标题
  title: {
    type: String,
    default: '',
  },
  //内容
  content: {
    type: String,
    default: '',
  },
  //点击遮罩 是否可关闭
  maskClosable: {
    type: Boolean,
    default: true,
  },
  //是否显示mask
  isMask: {
    type: Boolean,
    default: true,
  },
  //是否显示mask
  isShowClose: {
    type: Boolean,
    default: true,
  },
  //淡入效果，自定义弹框插入input输入框时传true
  fadeIn: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  type: {
    type: String as PropType<DialogType>,
    default: 'double',
  },
  className: {
    type: String,
    default: '',
  },
}
export type ButtonProps = ExtractPropTypes<typeof dialogProps>
