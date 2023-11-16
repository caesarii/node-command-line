const net = require('net')

const log = console.log.bind(this)

const config = {
  'PORT': 3000,
}

const server = net.createServer(function(socket) {
  socket.setEncoding('utf8')
  socket.on('data', function(data) {
    log('data', data)

    socket.write(`${new Date()}: ${data}`)
  })
})

server.listen(config.PORT, function() {
  log('server listenning on *:3000')
})