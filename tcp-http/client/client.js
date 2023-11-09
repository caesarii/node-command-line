const net = require('net')

const socket = net.connect(3000, '127.0.0.1')

const log = console.log

socket.setEncoding('utf8')

socket.on('connect', function() {
  log('connect succeed')

  process.stdin.pipe(socket)
  socket.pipe(process.stdout)
  process.stdin.resume()
})

// 通过data事件手动读取或写入数据,等价于上面两个pipe
// socket.on('data', function(data) {
//   process.stdout.write(data)
// })
// process.stdin.on('data', function(data) {
//   socket.write(data)
// })

class HttpClient {
  
}