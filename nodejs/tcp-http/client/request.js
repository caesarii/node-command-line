
class Request {
  constructor(url) {
    // parsedUrl
    // this.url = url

  }

  r(path, option) {
    const { method, protocl = 'HTTP/1.1'  } = option
    return `${method} ${path} ${protocl}`
  }

  get(path) {
    return this.r(path, { method: 'GET'})

  }

  post() {
    return this.r(path, { method: 'POST'})
  }
}


module.exports = Request