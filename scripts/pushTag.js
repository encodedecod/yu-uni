const { resolve } = require('path')
const package = require(resolve('package.json'))
const { exec } = require('child_process')

// 拼接git push命令
const remoteName = 'origin' // 修改为你的远程仓库名称

const gitPushCommand = `git push ${remoteName} v${package.version}`

// 执行git push命令
exec(gitPushCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing git push: ${error}`)
    return
  }
  console.log(`上传tag成功！`)
})
