const net = require('net')
const log = console.log


const config = {
  host: 'smtp.163.com',
  port: 25,
  fromAddress: 'a869115421@163.com',
  toAddress: 'iwangqinghe@163.com',
  authcode: 'IKAQRIULDIVAQHEI',
  password: '19900606adgjmP'

}

const CommandType = {
  HELO: 'HELO',
  AUTH_LOGIN: 'AUTH LOGIN',
  MAIL_FROM: 'MAIL FROM',
  RCPT_TO: 'RCPT TO'
}

const Status = {
  continue: '220',
  ok: '250',
  wait: '334',
  fail: '535'
}

function toBase64Buffer(str) {
  const r = Buffer.from(str, 'utf8').toString('base64')
  return r
}


function __main() {

  const socket = net.connect(config.port, config.host)

  socket.setEncoding('utf8')

  socket.on('connect', function() {
    log('connect succeed')

    // socket.pipe(process.stdout)
  })


  socket.on('data', function(res) {
    log('res:', res.toString())

    const statusCode = res.slice(0, 3)
    if(statusCode === Status.continue) {
      const heloCommand = 'EHLO Heqy\r\n'
      socket.write(heloCommand)
    }

    if (res.includes('250')) {
    socket.write(`${CommandType.AUTH_LOGIN}\r\n`)

    }

    if (res.includes('334 dXNlcm5hbWU6')) {
      socket.write(`${toBase64Buffer(config.fromAddress)}\r\n`)
    
    }
    if (res.includes('334 UGFzc3dvcmQ6\r\n')) {
      socket.write((`${toBase64Buffer(config.authcode)}\r\n`))
    }

    if (res.includes('235 Authentication successful')) {
      socket.write((`${CommandType.MAIL_FROM}: <${config.fromAddress}> \r\n`))
    }

    if (res.includes('250 Mail OK')) {
      socket.write((`${CommandType.RCPT_TO}: <${config.toAddress}> \r\n`))
    }

    // sendData('DATA')

  })



}

__main()