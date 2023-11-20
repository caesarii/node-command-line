const net = require('net')

const log = console.log

const Mode = {
  LOGIN: 'LOGIN',
  CHAT: 'CHAT'
}

class User {
  constructor(name, token = '') {
    this.name = name
    this.token = token
  }
}

class Connection {
  constructor(socket, user = null) {
    this.socket = socket
    this.user = user
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage(msg) {
    try {
     this.socket && this.socket.write(`${msg} \r\n`)
    } catch(e) {
      console.error('send message failed', e)
    }
  }
}

class TcpServer {
  constructor() {
    this.server = this.createServer()
    this.users = {}
    this.connections = {}
  }

  broadcast(msg, name) {
    const self = this
    Object.keys(self.connections).forEach(u => {
      const conn = self.connections[u]

      // 广播不包含当前用户
      if (conn.user.name !== name) {
        conn.sendMessage(msg)
      }

    })
  }

  createServer() {
    const self = this
    function dataHandler(data, conn) {
      const input = data.replace(/\n|\r\n/g, '')
      // server与client之间通过 name##content 格式通信传递用户名
      const [ name, msg ] = input.split('##')

      if(msg.startsWith('LOGIN')) {
        const [_, loginName] = msg.split(' ')
        if (self.users[loginName]) {
          conn.sendMessage(`nickname ${loginName} already in use. try again. \n`)
          return
        } else {
          const u = new User(loginName)
          self.users[loginName] = u
          conn.user = u
          self.connections[loginName]  = conn
          self.broadcast(`system said: ${loginName} joined th room.`, loginName)

          conn.sendMessage(`${loginName}##login succeed! start chat.`)
        }

      } else {
        // 默认当做聊天
        self.broadcast(`${name} said: ${msg}`, name)
      }
    }

    function connectHandler(socket) {
      const userCount = Object.keys(self.users).length
      const conn = new Connection(socket)

      conn.sendMessage(
`welcome to node-caht!
${userCount} other people are connected at this time.
please login: LOGIN <name>.\r\n`)
    
      socket.setEncoding('utf8')
      socket.on('data', function(data) {
        dataHandler(data, conn)
      })
      socket.on('close', function () {
        // 如何删除 conn
        log('someone leave')
      })

      socket.on('error', function (error) {
        // 如何删除 conn
        log('socket error', error)
      })
    }
    return net.createServer(connectHandler)
}

  start() {
    this.server.listen(3000, function () {
      log('server listenning on *:3000')
    })
  }
}

function __main() {
  const server = new TcpServer()
  server.start()
}

__main()


