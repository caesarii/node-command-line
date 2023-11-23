from socket import * 
import re

class Connection:
  def __init__(self, sock, user = None ):
    self.sock = sock
    self.user = user
  
  def sendMessage(self, msg):
    self.sock.send(bytes('{0} \r\n'.format(msg), 'utf-8'))

class User:
  def __init__(self, name, token = ''):
    self.name = name
    self.token = token

class Server:
  users = {}
  connections = {}
  def __init__(self):
    self.server = self.createServer()

  def broadcast(self, msg, name):
    for (key, conn)  in self.connections.items():
      #  广播不包含当前用户
      # if conn.user.name != name:
      conn.sendMessage(msg)
  
  def createServer(self):
    server = socket(AF_INET, SOCK_STREAM)
    server.bind(('127.0.0.1', 3000))
    server.listen(5)

    def handleChat(conn):
        while True:
          req = conn.sock.recv(1024)
          req = req.decode('utf-8')
          req = re.sub(r'\n|\r\n/', '', req)
          print('req', req)
          if not req:
            break
          # server与client之间通过 name##content 格式通信
          msg = req
          # if req.startswith('##') >= 0:
          #   conn.sendMessage('please login')
          if req.find('##') >= 0:
            [name, msg] = req.split('##')

          if name:
            #  已登录
            self.broadcast('{0} said: {1}'.format(name, msg), name)
          elif msg.startswith('LOGIN'):
            # 登录
            [_, loginName] = msg.split(' ')
            if self.users.get(loginName) != None:
              conn.sendMessage('nickname {0} already in use. try again. \n'.format(loginName))
            else:
              u = User(loginName)
              self.users[loginName] = u
              conn.user = u
              self.connections[loginName] = conn

              print('loginName', loginName)
              # self.broadcast('system said: {0} joined th room.'.format(loginName), loginName)

              conn.sendMessage('{0}##login succeed! start chat.'.format(loginName))
          else:
            # 未登录
            conn.sendMessage('please login: LOGIN <name>.\r\n')

    try: 
      while True:
        print('server listening on 127.0.0.1:3000')
        (tSocket, addr) = server.accept()
        conn = Connection(tSocket)
        conn.sendMessage('welcome to node-caht! \r\n {userCount} other people are connected at this time. \r\n please login: LOGIN <name>.\r\n')
        print('new connection')

        handleChat(conn)
      
    except KeyboardInterrupt:
      tSocket.close()
      server.close()
    finally:
      # print('error', TypeError)
      tSocket.close()
      server.close()

def __main():
  s = Server()

__main()