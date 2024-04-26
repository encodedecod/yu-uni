<p align="center">uni组件库，支持移动端 H5 和 小程序开发</p>

## 特性

- 🚀 高质量组件，覆盖移动端主流场景
- 💡 支持 vscode 组件属性高亮
- 🍭 支持按需引用
- 💪 支持 TypeScript

---

### 项目运行

项目推荐使用 pnpm 的方式安装运行，启动方式：

1. 安装依赖

组件库

```bash
pnpm add @yu-kit/components
```

### 组件构建

- 构建 npm 版本代码：

```bash
pnpm build:lib
```

### vue3的setup组件限制

- 组件需把props传递到组件内部：

```bash
    <view
      v-show="props.isBlockTop"
      :style="{ height: `${navigatorBottom}px`, backgroundColor: props.backgroundColor }"
    />
```

- import { 变量 } form 模块： 变量如果在script文件中未被引用，需要手动const定义才能在打包后被组件内部使用

```bash
  import { COLOR } from '../../../config'
  >>>>
  import * as config from '../../../config'
  const COLOR = config.COLOR
```
