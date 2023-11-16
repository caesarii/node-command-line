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