const { copy, remove, writeFileSync } = require('fs-extra')
const { resolve } = require('path')
const buildPackageScript = require('./package')
const buildStyle = require('./style')
const buildTypes = require('./types')
const { SRC_DIR, LIB_DIR, PACK_DIR } = require('./const')

const copyFiles = [
  {
    src: resolve(PACK_DIR, './package.json'),
    dest: resolve(LIB_DIR, '../package.json'),
  },
  {
    src: resolve(PACK_DIR, './README.md'),
    dest: resolve(LIB_DIR, '../README.md'),
  },
]

const copySourceCode = async () => {
  const dirs = copyFiles

  return Promise.all(
    dirs.map((dir) => {
      return copy(resolve(SRC_DIR, dir.src), dir.dest)
    })
  ).then(() => {
    const version = require('../../package.json').version
    const destPackageJson = require(resolve(LIB_DIR, '../package.json'))
    destPackageJson.version = version
    writeFileSync(resolve(LIB_DIR, '../package.json'), JSON.stringify(destPackageJson, null, 2))
  })
}

const clean = async () => {
  await Promise.all([remove(LIB_DIR)])
}

const tasks = [
  {
    text: '复制源代码',
    task: copySourceCode,
  },
  {
    text: '构建样式',
    task: buildStyle,
  },
  {
    text: '构建组件',
    task: buildPackageScript,
  },
  {
    text: '构建类型提示文件',
    task: buildTypes,
  },
]

const runBuildTasks = async () => {
  for (let i = 0; i < tasks.length; i++) {
    const { task, text } = tasks[i]

    try {
      console.log(text)
      await task()
    } catch (err) {
      console.error(text)
      throw err
    }
  }

  console.log('构建成功')
}

const build = async () => {
  process.env.NODE_ENV = 'production'
  try {
    console.log('开始构建')
    await clean()
    await runBuildTasks()
  } catch (err) {
    console.error('构建失败', err)
    process.exit(1)
  }
}

build()
