const Guide = [{ text: '快速开始', link: '/guide/' }]

const components = [
  { text: '按钮组件', link: '/components/Button/' },
  { text: '轻提示组件', link: '/components/Toast/' },
]

const DefaultSideBar = [
  { text: '指南', items: Guide },
  { text: '组件文档', items: components },
]

export default {
  base: '/yu-uni/',
  title: 'quni',
  lang: 'zh-CN',
  themeConfig: {
    logo: '/logo.png',
    lastUpdated: true,
    lastUpdatedText: '最后修改时间',
    socialLinks: [{ icon: 'github', link: 'https://github.com/encodedecod/yu-uni/' }],
    nav: Guide,
    // 侧边栏
    sidebar: DefaultSideBar,
  },
}
