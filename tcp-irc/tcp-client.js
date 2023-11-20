const net = require('net')


const log = console.log

class Client {
  constructor() {
    this.socket = this.connect()
    this.name = 'Anonymous'
  }

  connect() {
    const self = this
    const socket = net.connect(3000, '127.0.0.1')

    socket.setEncoding('utf8')

    socket.on('connect', function() {
      log('connect succeed')

      socket.on('data', function(data) {
        const [ msg, name ] = data.split('##')
        if (name && self.name.startsWith('Anonymous')) {
          self.name = name
        }
        process.stdout.write(msg)
        process.stdin.resume()
      })
      process.stdin.on('data', function(data) {
        // log('name', self.name)
        socket.write(`${data}##${self.name}`)
      })
    })

    return socket

  }
}

function __main() {
  new Client()
}

__main()



