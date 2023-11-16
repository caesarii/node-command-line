#!/usr/bin/env node
const { readFile } = require('fs/promises')
const yargs = require('yargs/yargs')

const log = console.log.bind(this, 'heqy')

function parse(file) {
  return readFile(file).then(buffer => {
    const value = JSON.parse(buffer.toString())
    log(value)
    return value
   })
  
}

function __main() {
  const args = process.argv
  const originalArgs = args.slice(2)
  const yArgs = yargs(originalArgs)
 
  log(
    // args, 
    originalArgs, 
    // parsedArgs
  )


// 要看明白 yargs 的文档，需要了解命令、选项、参数的概念
// command: 定义命令
// options: 定义选项
// 其他大多数api都是command或者options的配置项，不要用，直接用配置项
  const argv = yArgs.options({
    'filename': {
      alias: 'f',
      describe: 'JSON file to parse',
      demandOption: true,
      nargs: 1
    },
    'search': {
      alias: 'g',
      describe: 'search',
      demandOption: true
    },
    'save': {
      alias: 's',
      describe: 'save',
    }
  })
  // .help()
  .argv

  const file = argv.f

  // 从命令行接受参数
  const stdin = process.stdin
  if (file === '-') {
    let params
    // 这里用 readable 事件不行, 原因未知
    stdin.on('data', data => {
      params = data.toString()
      if(!params.includes('.json')) {
        process.stdout.write('请输入正确的文件路径:' + "\n\n")
      } else {
        stdin.destroy()
      }
    })

    process.stdin.on('close', () => {
      // 去掉回车
      parse(params.slice(0, params.length - 1))
    }); 
  } else {
    parse(file)
  }
}



__main()