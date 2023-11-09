const net = require('net')
const Request = require('./request')
const Response = require('./response')
const {log, error, } = require('../utils')


class HttpServer {
    constructor() {
        this.routeMapper = {}
    }
    
    use(path, router) {
        this.routeMapper[path] = router
    }
    
    listen(host, port) {
        // 创建服务器
        const server = new net.Server()
        
        // 开启服务器监听连接
        server.listen(port, host, () => {
            console.log('listening on server: ', server.address())
        })
        
        server.on('connection', (socket) => {
            // 接收数据
            socket.on('data', (data) => {
                const raw = data.toString('utf8')
                
                const response = this.responseFor(raw)
                socket.write(response)
                
                socket.destroy()
            })
        })
        
        server.on('error', (error) => {
            log('server error', error)
        })
        
        server.on('close', () => {
            log('server closed')
        })
    }
    
    responseFor(raw) {
        const request = new Request(raw)
        const response = new Response()
        request.init()
        
        const route = {}
        const routes = Object.assign(route, this.routeMapper)
        const router = routes[request.path] || error
        return router(request, response)
    }
}

module.exports = HttpServer