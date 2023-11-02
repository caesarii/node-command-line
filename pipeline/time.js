

process.stdin.pipe(process.stdout)

const start = Date.now()
process.on('exit', function () {
  console.log('time: ', (Date.now() - start)/1000)
})