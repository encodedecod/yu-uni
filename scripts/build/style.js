const { extname, basename, resolve } = require('path')
const { lstatSync, readdirSync } = require('fs-extra')
const fg = require('fast-glob')
const { SRC_DIR, LIB_DIR } = require('./const')
const { src, dest } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const gulpSass = require('gulp-sass')
const sassLang = require('sass')
const sass = gulpSass(sassLang)

// 暂不输出
const excludeComponents = []
const replaceExt = (file, ext) => file.replace(extname(file), ext)

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

const buildStyles = () => {
  let tasks = []

  queryFiles(resolve(SRC_DIR, 'components'), ['.scss']).forEach((file) => {
    const filePath = fg.win32.convertPathToPattern(file)
    let folderName = replaceExt(basename(filePath), '')

    if (folderName === 'index') {
      folderName = filePath.match(/\/components\/(.+)\/index\.scss$/)?.[1]
    }

    if (folderName && !excludeComponents.includes(folderName)) {
      src(resolve(SRC_DIR, `components/${folderName}/index.scss`))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(dest(resolve(LIB_DIR, `components/${folderName}`)))
    }
  })

  return Promise.all(tasks)
}

const tasks = [
  {
    text: '构建样式文件',
    task: buildStyles,
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
}

const buildStyle = async () => {
  try {
    await runBuildTasks()
    console.log('样式文件构建完成')
  } catch (err) {
    console.error('样式文件构建失败', err)
  }
}

module.exports = buildStyle
