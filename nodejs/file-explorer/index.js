
const fs = require('fs')

const log = console.log

let currentDir = ''


function listDir(dir, space) {
  const files = fs.readdirSync(dir)

  files.forEach((file, i) => {
    const filePath = `${dir}/${file}`

    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      log(`${space}${i}: ${file}: D`)
      // 先不输出目录
      // list(filePath, ' ')

    } else {
      log(`${space}${i}: ${file}: F`)
    }
  })


}

function list(path, space = '') {
  const realPath = `${__dirname}/${path}`
  const stat = fs.statSync(realPath)
  if (stat.isDirectory()) {
    currentDir = path
    listDir(realPath, space)
    
  } else {
    const content = fs.readFileSync(realPath).toString()
    log('content', content)
    process.stdout.write(content)
  }
}

function handleInput () {
  process.stdout.write('Please enter your choice: \n\n')
  process.stdin.resume()
  process.stdin.on('data', function(data) {
    const option = data.toString()
    list(`${currentDir}/${option.slice(0, option.length - 1)}`)
  })
}

function explorer() {
  // node index.js ./
  const dir = process.argv[2]

  list(dir)

  handleInput(dir)
}

function __main() {
  explorer()
}


__main()