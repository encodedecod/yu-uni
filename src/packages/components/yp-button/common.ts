import type { ExtractPropTypes, PropType, SVGAttributes } from 'vue'

export type ButtonTheme = 'default' | 'primary' | 'border'
export type ButtonType = 'flex' | 'normal'
export type ButtonSize = 'normal' | 'large'

export const buttonProps = {
  theme: {
    type: String as PropType<ButtonTheme>,
    default: 'primary',
  },
  type: {
    type: String as PropType<ButtonType>,
    default: 'normal',
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: 'normal',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
