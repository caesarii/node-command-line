const net = require('net')

const log = console.log

let count = 0
let users = {}
const Mode = {
  LOGIN: 'LOGIN',
  CHAT: 'CHAT'
}
let currentMode = Mode.CHAT

const server = net.createServer(function(socket) {
  log('new connection')
  socket.write(`
    welcome to node-caht!
    ${count} other people are connected at this time.
    please choose your mode: LOGIN | CHAT \n`)
  count ++

  socket.setEncoding('utf8')
  
  socket.on('data', function(data) {
    

    const input = data.replace(/\n|\r\n/g, '')
    log('server data', input, input === Mode.LOGIN)
    if(input === Mode.LOGIN) {
      log('enter login')
      currentMode = Mode.LOGIN
      socket.write(`please enter your nickname. \n`)
      return
    } 
    if(input === Mode.CHAT) {
      currentMode = Mode.CHAT
      socket.write(`please start your chat. \n`)
      return 
    }

    if(currentMode === Mode.LOGIN) {
      if (users[input]) {
        socket.write(`nickname ${input} already in use. try again. \n`)
        return
      } else {
        users[input] = socket
        for (let u in users) {
          users[u].write(`${input} joined th room. \n`)
        }
        socket.write(`login succeed! start chat. \n`)
        currentMode = Mode.CHAT
      }
    } else if(currentMode === Mode.CHAT) {
      // 默认当做聊天
      for (let u in users) {
        users[u].write(`someone said: ${input}. \n`)
      }
    }
  })

  socket.on('close', function () {
    count --
    log('someone leave')
  })
})


server.listen(3000, function () {
  log('server listenning on *:3000')
})