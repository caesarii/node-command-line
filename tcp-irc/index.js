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
  constructor(socket, user) {
    this.socket = socket
    this.user = user
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage(msg) {
    this.socket.write(`${msg} \r\n`)
  }
}

class TcpServer {
  constructor() {
    this.server = this.createServer()
    this.mode = Mode.LOGIN
    this.users = {}
    this.connections = {}
  }

  broadcast(msg) {
    const self = this
    Object.keys(self.connections).forEach(u => {
      const conn = self.connections[u]
      conn.sendMessage(`${conn.user.name} said: ${msg} \r\n`)
    })
  }

  createServer() {
    const self = this
    function dataHandler(data, conn) {
      const input = data.replace(/\n|\r\n/g, '')
      const [ msg, name ] = input.split('##')
      log('##', msg, name)
    
      if(msg === Mode.LOGIN) {
        self.mode = Mode.LOGIN
        conn.sendMessage(`please enter your nickname.`)
        return
      } 
      if(msg === Mode.CHAT) {
        self.mode = Mode.CHAT
        conn.sendMessage(`please start your chat.`)
        return 
      }
  
      if(self.mode === Mode.LOGIN) {
        if (self.users[msg]) {
          conn.sendMessage(`nickname ${msg} already in use. try again. \n`)
          return
        } else {
          self.users[msg] = new User(msg)
          // 删除匿名
          delete self.users[name]
          self.broadcast(`${msg} joined th room.`)

          conn.sendMessage(`login succeed! start chat. \n`)
          self.mode = Mode.CHAT
        }
      } else if(self.mode === Mode.CHAT) {
        // 默认当做聊天
        self.broadcast(msg)
      }
    }

    function connectHandler(socket) {
      const userCount = Object.keys(self.users).length

      const name = `Anonymous-${userCount}`
      const user = new User(name)
      const conn = new Connection(socket, user)
      self.connections[name]  = conn

      // server与client之间通过 ##name 传递用户名
      conn.sendMessage(`
        welcome to node-caht!
        ${userCount} other people are connected at this time.
        please choose your action: LOGIN | CHAT ##${name}`)
    
      socket.setEncoding('utf8')
      socket.on('data', function(data) {
        dataHandler(data, conn)
      })
      socket.on('close', function () {
        // 如何删除 conn
        log('someone leave')
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


