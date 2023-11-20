const net = require('net')


const log = console.log

class Client {
  constructor() {
    this.socket = this.connect()
    this.name = ''
  }

  connect() {
    const self = this
    const socket = net.connect(3000, '127.0.0.1')

    socket.setEncoding('utf8')

    socket.on('connect', function() {
      process.stdout.write('connect succeed\r\n')

      socket.on('data', function(data) {
        let msg = data
        if(data.includes('##')) {
          let [name, _msg] = data.split('##')
          msg = _msg
          if (name) {
            self.name = name
          }
        }
        process.stdout.write(msg)
      })

    })

    process.stdin.on('data', function(data) {
      socket.write(`${self.name}##${data}\r\n`)
    })

    return socket

  }
}

function __main() {
  new Client()
}

__main()



