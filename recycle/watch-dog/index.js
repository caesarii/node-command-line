const fs =require('fs');

// const stream = fs.createReadStream('test.txt')
const log = console.log

var files = fs.readdirSync(process.cwd())
files.forEach(function(file) {
  if(/\.css/.test(file)) {
    log(`${process.cwd()}/${file}`)
    fs.watchFile(`${process.cwd()}/${file}`, function() {
      log(`${file} changed~`)
    })
  }
})
