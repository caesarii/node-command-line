#!/usr/bin/env node
const { readFile } = require('fs/promises')

const log = console.log.bind(this, 'heqy')

function parse(file) {
  return readFile(file).then(buffer => {
    const value = JSON.parse(buffer.toString())
    log(value)
    return value
   })
  
}

// 以形如 '-f'的处理为选项, 非 - 开头的处理为参数, '-'作为特殊参数
function parseArgs(args) {

  const options = args.slice(2)
  const obj = {}
  let i = 0
  while(i < options.length) {
    const curr = options[i]
    if(curr.startsWith('-')) {
      obj[curr.slice(1)] = options[i+1]
      i +=2
    } else {
      log('args format is wrong')
    }
  }
  return obj
}

function __main() {
  const args = process.argv
  const parsedArgs = parseArgs(args)
 
  log(
    args, 
    parsedArgs
  )


  const file = parsedArgs.f

  if (!file) {
    log('-f 参数是必须的')
  }

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