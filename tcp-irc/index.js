const net = require('net')

const log = console.log

const Mode = {
  LOGIN: 'LOGIN',
  CHAT: 'CHAT'
}

class User {
  constructor(name, socket, token) {
    this.name = name
    this.socket = socket
    this.token = token
  }
}


class TcpServer {
  constructor() {
    this.server = this.createServer()
    this.socket = null
    this.count = 0
    this.mode = Mode.LOGIN
    this.users = {}
    this.sendMessage = this.sendMessage.bind(this)
  }


  sendMessage(msg) {
    this.socket.write(`${msg} \r\n`)
  }

  createServer() {
    const self = this
    function dataHandler(data) {
      const input = data.replace(/\n|\r\n/g, '')
    
      if(input === Mode.LOGIN) {
        self.mode = Mode.LOGIN
        self.sendMessage(`please enter your nickname.`)
        return
      } 
      if(input === Mode.CHAT) {
        self.mode = Mode.CHAT
        socket.write(`please start your chat.`)
        return 
      }
  
      if(self.mode === Mode.LOGIN) {
        if (self.users[input]) {
          self.sendMessage(`nickname ${input} already in use. try again. \n`)
          return
        } else {
          self.users[input] = self.socket
          for (let u in self.users) {
            self.users[u].write(`${input} joined th room. \n`)
          }
          self.socket.write(`login succeed! start chat. \n`)
          self.mode = Mode.CHAT
        }
      } else if(self.mode === Mode.CHAT) {
        // 默认当做聊天
        for (let u in self.users) {
          self.users[u].write(`someone said: ${input}. \n`)
        }
      }
    }

    function connectHandler(socket) {
      self.socket = socket

      socket.write(`
        welcome to node-caht!
        ${this.count} other people are connected at this time.
        please choose your action: LOGIN | CHAT \n`)
      this.count ++
    
      socket.setEncoding('utf8')
      
      socket.on('data', dataHandler)

      socket.on('close', function () {
        this.count --
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


