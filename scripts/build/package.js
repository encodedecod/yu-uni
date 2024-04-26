const { parse: parseSFC } = require('@vue/compiler-sfc')
const { resolve } = require('path')
const fg = require('fast-glob')
const { readFile, remove, lstatSync, outputFileSync, readdirSync } = require('fs-extra')
const { extname, basename } = require('path')
const { build } = require('vite')
const { SRC_DIR, LIB_DIR, PACK_DIR } = require('./const')

const package = require(resolve(PACK_DIR, 'package.json'))

const input = {}
const setupFilepathList = []

// 暂不输出
const excludeComponents = []

const banner = `/*!
* ${package.name} v${package.version} ${new Date()}
* Released under the MIT License.
*/`

const replaceExt = (file, ext) => file.replace(extname(file), ext)

const parseSFCFile = async (filePath, name) => {
  const sources = await readFile(filePath, 'utf-8')
  const { descriptor } = parseSFC(sources, {
    sourceMap: false,
  })
  const { script, template, styles, scriptSetup } = descriptor
  if (script?.content) {
    const jsFilePath = replaceExt(filePath, '-sfc.ts')

    outputFileSync(jsFilePath, script?.content)
    input[name] = jsFilePath
    const outputSFCPath = resolve(
      LIB_DIR,
      // TODO: 临时兼容特殊情况
      `components/${filePath.split('/components/').slice(1).join('/components/')}`
    )
    outputFileSync(
      outputSFCPath,
      `
          <template>${template?.content}</template>\n<script>import s from './index.js';export default s;</script>${
            styles.length ? `\n<style>@import './index.css';</style>` : ''
          }
        `.trim()
    )
  }
  if (scriptSetup?.content) {
    const jsFilePath = replaceExt(filePath, '-sfc.ts')

    outputFileSync(jsFilePath, scriptSetup.content)
    input[name] = jsFilePath
    setupFilepathList.push({
      name,
      filePath,
    })
  }
}

const queryFiles = (dir, exts, list = []) => {
  const files = readdirSync(dir)

  files.forEach((file) => {
    const filePath = resolve(dir, file)

    const stat = lstatSync(filePath)

    if (stat.isDirectory()) {
      list.concat(queryFiles(filePath, exts, list))
    } else if (exts.includes(extname(file))) {
      list.push(filePath)
    }
  })

  return list
}

const copySFCFiles = () => {
  let tasks = []
  queryFiles(resolve(SRC_DIR, 'components'), ['.vue']).forEach((file) => {
    const filePath = fg.win32.convertPathToPattern(file)
    let folderName = replaceExt(basename(filePath), '')

    if (folderName === 'index') {
      folderName = filePath.match(/\/components\/(.+)\/index\.vue$/)?.[1]
    }
    folderName && !excludeComponents.includes(folderName) && tasks.push(parseSFCFile(filePath, folderName))
  })

  return Promise.all(tasks)
}

const writeSetupSFC = async () => {
  await Promise.all(
    setupFilepathList.map(async (item) => {
      const { filePath } = item
      const sources = await readFile(filePath, 'utf-8')
      const { descriptor } = parseSFC(sources, {
        sourceMap: false,
      })
      const { template, styles } = descriptor
      const replaceStr = `const props = computed(() => {
        const data = {}
        Object.keys(defaultProps || {}).forEach((key) => {
          data[
            key
              .split('-')
              .map((val, i) => (i ? val.replace(val[0], val[0].toUpperCase()) : val))
              .join('')
          ] = defaultProps[key]
        })
        return data
      })`
      const outputSFCPath = resolve(
        LIB_DIR,
        // TODO: 临时兼容特殊情况
        `components/${filePath.split('/components/').slice(1).join('/components/')}`
      )

      const content = (await readFile(resolve(outputSFCPath, '../index.js'), 'utf-8'))
        .replace(/\nconst props =([\s\S]*?\);\n{0,1})/g, (val, $1) => {
          return `\nconst defaultProps =${$1}${replaceStr}\n`
        })
        .replace(/([^w])props\??\./g, '$1props.value.')
      remove(resolve(outputSFCPath, '../index.js'))
      outputFileSync(
        outputSFCPath,
        `
          <template>${template?.content}</template>\n<script setup>\nimport { computed, unref } from 'vue'\n ${content}
          </script>${styles.length ? `\n<style>@import './index.css';</style>` : ''}
        `.trim()
      )
    })
  )
}
process.on('uncaughtException', (err, origin) => {
  console.log(origin, err)
  // 出现错误时 也要把生成的多余文件删除
  Promise.all(Object.keys(input).map((key) => remove(input[key])))
})

const buildDisperse = () => {
  return build({
    configFile: false,
    build: {
      minify: 'terser',
      target: 'esnext',
      lib: {
        entry: '',
        name: 'index',
        formats: ['es'],
      },
      terserOptions: {
        keep_fnames: true,
      },
      optimizeDeps: false,
      emptyOutDir: false,
      rollupOptions: {
        external: ['vue'],
        treeshake: false,
        input,
        output: {
          banner,
          dir: resolve(LIB_DIR, `components`),
          entryFileNames: '[name]/index.js',
        },
      },
    },
  })
}

const firstUpperCase = (str) => `${str[0].toUpperCase()}${str.substring(1)}`
const camelize = (str) => str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))

const genEntryFile = () => {
  let importStr = ''
  const packages = []
  queryFiles(resolve(SRC_DIR, 'components'), ['.vue']).forEach((file) => {
    const filePath = fg.win32.convertPathToPattern(file)
    let folderName = replaceExt(basename(filePath), '')

    if (folderName === 'index') {
      folderName = filePath.match(/\/components\/(.+)\/index\.vue$/)?.[1]
    }

    if (folderName && !excludeComponents.includes(folderName)) {
      const componentName = firstUpperCase(camelize(folderName))
      importStr += `import ${componentName} from './components/${folderName.toLowerCase()}/index.vue';\n`
      packages.push(componentName)
    }
  })
  let installFunction = `function install(app) {
    const packages = [${packages.join(',')}];
    packages.forEach((item) => {
      if (item.install) {
        app.use(item);
      } else if (item.name) {
        app.component(item.name, item);
      }
    });
  }`

  let fileStrBuild = `${importStr}
${installFunction}
const version = '${package.version}';
export { install, version, ${packages.join(', ')} };

export default { install, version };`

  outputFileSync(resolve(LIB_DIR, 'index.js'), fileStrBuild, 'utf8')
}

const buildPackageScript = async () => {
  try {
    await copySFCFiles()

    await buildDisperse()

    await writeSetupSFC()
    await genEntryFile()
    Promise.all(Object.keys(input).map((key) => remove(input[key])))
    // await buildModule();
  } catch (e) {
    console.error('构建组件失败', e)
    await Promise.all(Object.keys(input).map((key) => remove(input[key])))
    process.exit(1)
  }
}

module.exports = buildPackageScript
