import { CSSProperties, ExtractPropTypes, PropType } from 'vue'
import type { IconType } from './type'

export const buttonProps = {
  //标题
  name: {
    type: String as PropType<IconType>,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  color: {
    type: String,
    default: '#000',
  },
  bold: {
    type: Boolean,
    default: false,
  },
  customStyle: {
    type: Object as PropType<CSSProperties>,
    default: {},
  },
  className: {
    type: String,
    default: '',
  },
}
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
