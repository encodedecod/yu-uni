// 微信小程序貌似不能用 暂时先放在这里 微信小程序没有document和windows
import { createApp, App, ComputedOptions, MethodOptions, Component, VNodeProps, AllowedComponentProps } from 'vue'
type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never
export const elementHandle = <P extends object>(component: Component<P, any, any, ComputedOptions, MethodOptions>) => {
  let div: HTMLDivElement
  let componentInstance: App<Element>
  const show = (props: ComponentProps<typeof component>) => {
    div = document.createElement('div')
    componentInstance = createApp(component, props)
    componentInstance.mount(div)
    document.body.appendChild(div)
  }
  const hide = () => {
    componentInstance.unmount()
    document.body.removeChild(div)
  }
  return {
    show,
    hide,
  }
}
