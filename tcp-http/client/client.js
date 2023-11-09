const net = require('net')
const fs = require('fs')

const Request = require('./request')

const log = console.log


class Url {
  constructor(url) {
    this.url = url
    this.protocol = ''
    this.host = ''
    this.port = ''
    this.parseUrl(url)
  }

  parseUrl(url) {
    // http://12y.0.0.1:3000/path?a=b&c=d#xxx
    const [protocol, rest1] = url.split('://')
    const [host, rest2 = ''] = rest1.split(':')
    const [port, rest3 = ''] = rest2.split('/')
    const [path, rest4 = ''] = rest3.split('?')
    const [query, hash = ''] = rest4.split('#')
    log({ protocol, host, port, path, query, hash })

    Object.assign(this, { protocol, host, port })
  }
}


class HttpClient {
  constructor() {

  }

  request(url, options = {}) {

    // TODO: 客户端功能扩展
    const { method, cookie } = options

    const parsedUrl = new Url(url)

    log('parsedUrl', parsedUrl)
    const { port, host } = parsedUrl
    
    const socket = net.connect(port, host)

    socket.setEncoding('utf8')

    socket.on('connect', function() {
      log('connect succeed')

      const req = new Request()

      socket.write(req.get('/'))
    })

    socket.on('data', function(data) {

      log('response', data)

      // TODO: 解析响应
      fs.writeFileSync(`${__dirname}/response/res.txt`, data.toString())
    })
  }
}


function __main() {

  const c = new HttpClient()
  c.request('http://127.0.0.1:3000/')
}

__main()