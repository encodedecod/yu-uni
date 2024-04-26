import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import readline from 'readline'

export const getIconFileContent = (base64String, fontFamily, className, sortedIcons) => {
  const fontFaceString = `@font-face {
  font-family: '${fontFamily}';
  /* stylelint-disable-next-line scss/operator-no-unspaced */
  src: url(data:application/font-woff2;charset=utf-8;base64,${base64String}) format("woff2");
  font-style: normal;
  font-weight: normal;
}

.${className} {
  font-family: '${fontFamily}' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
  return `${[fontFaceString, ...sortedIcons].join('\n\n')}\n`
}

export const getInvalidNameIcons = (icons, classPattern) =>
  icons.filter((item) => !classPattern.test(item)).map((item) => item.split('::')[0])

export const getFormatIcons = (origin) =>
  origin
    .replace(/(^[\r\n]*)|([\r\n]*$)/g, '')
    .split('\n\n')
    .slice(2)
    .map((item) => item.replace(/:before/g, '::before'))
    .sort((a, b) => (a === b ? 0 : a > b ? 1 : -1))

export const getIconNames = (origin, prefix) =>
  getFormatIcons(origin)
    .filter((icon) => icon.indexOf('::') !== -1)
    .map((icon) => icon.split('::')[0].slice(1))
    .map((icon) => icon.replace(new RegExp(`^${prefix}`), ''))

export const getTypesFileContent = (icons) => {
  const typeString = icons.map((icon) => `'${icon}'`).join('\n  | ')

  return `/**
 * 此文件不要手动改，用iconSync脚本同步
 */

export type IconType =
  | ${typeString}
`
}

const iconSync = async ({
  iconName,
  /** iconfont中设置的FontClass/Symbol前缀，用来去掉前缀生成类型名 */
  iconNamePrefix,
  /** 生成的样式文件的目标地址 */
  outputPath,
  /** 校验icon名称的正则 */
  classPattern,
  fontFamily,
  /** 生成的类型文件目标地址, 没有这个参数表示不生成类型文件 */
  outputTypePath,
  url,
}) => {
  if (/\/(font.*)\.css/.test(url)) {
    // fetch 字体相关文件
    const iconsScss = Buffer.from(await (await fetch(`http:${url}`)).arrayBuffer()).toString('utf-8')
    const woff2 = Buffer.from(await (await fetch(`http:${url.replace(/\.css$/, '.woff2')}`)).arrayBuffer()).toString(
      'base64'
    )
    // 获取格式化后的icon数组
    const sortedIcons = getFormatIcons(iconsScss)

    // 抓出非法icon
    const invalidNameIcons = getInvalidNameIcons(sortedIcons, classPattern)
    if (invalidNameIcons.length) {
      // eslint-disable-next-line no-console
      console.log(`下列icon命名不规范\n${invalidNameIcons.join('\n')}\n`)
    }

    try {
      // 把整理好的icon内容写入文件icon.scss
      fs.writeFile(path.resolve(outputPath), getIconFileContent(woff2, fontFamily, iconName, sortedIcons), () => {
        console.log('成功写入iconfont样式配置')
      })

      // 类型信息写入类型文件
      if (outputTypePath) {
        fs.writeFile(path.resolve(outputTypePath), getTypesFileContent(getIconNames(iconsScss, iconNamePrefix)), () => {
          console.log('成功写入iconfont类型文件')
        })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('哎呀，出问题了', err)
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('检查一下是不是正确的阿里云的iconfont地址')
  }
}

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
read.question('请输入阿里云iconfont在线css地址: ', (url) => {
  iconSync({
    iconName: 'iconfont',
    iconNamePrefix: '',
    outputPath: 'src/packages/components/yp-icon/index.scss',
    classPattern: new RegExp(/\.[0-9a-z]+/),
    fontFamily: 'iconfont',
    outputTypePath: 'src/packages/components/yp-icon/type.ts',
    url,
  })
  read.close()
})
