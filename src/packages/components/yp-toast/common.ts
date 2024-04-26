import type { ExtractPropTypes, PropType } from 'vue'
import { IconType } from '../yp-icon/type'

export type ToastType = 'success' | 'failure' | 'notice' | 'loading'

export const TOAST_TYPE_MAP = {
  success: 'y-selected',
  loading: 'y-loading',
  failure: 'y-close',
  notice: 'y-notice',
}
export const toastProps = {
  //icon名称
  iconName: {
    type: String as PropType<IconType>,
    default: '',
  },
  type: {
    type: String as PropType<ToastType>,
    default: '',
  },
  duration: {
    type: Number,
    default: 2000,
  },
  //内容
  content: {
    type: String,
    default: '',
  },
  //是否显示mask
  isMask: {
    type: Boolean,
    default: false,
  },
  //淡入效果
  fadeIn: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
}
export type ButtonProps = ExtractPropTypes<typeof toastProps>
