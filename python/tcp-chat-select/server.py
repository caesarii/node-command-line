from socket import * 
import re
import traceback
from time import ctime

class Connection:
  sock = None
  user = None
  greetted = False
  def __init__(self, sock, user = None ):
    self.sock = sock
    self.user = user
  
  def send(self, msg):
    self.sock.send(bytes('{0} \r\n'.format(msg), 'utf-8'))

  def receive(self):
   return self.sock.recv(1024)

  def close(self):
    self.sock.close()

  def greeting(self):
    if not self.greetted:
       self.send('welcome to node-caht! \r\n please login: LOGIN <name>.\r\n')
       self.greetted = True


class User:
  def __init__(self, name, token = ''):
    self.name = name
    self.token = token

class Server:
  users = {}
  connects = []
  def __init__(self):
    self.server = self.createServer()

  def broadcast(self, msg, name):
    for conn  in self.connects:
      #  广播不包含当前用户
      if conn.user.name != name:
        conn.send(msg)

  def quit(self, conn):
    conn.close()
    self.connects.remove(conn)
    name = conn.user.name
    self.broadcast('{0} leave'.format(name), name)

  def login(self, loginName, conn):
    if self.users.get(loginName) != None:
      conn.send('nickname {0} already in use. try again. \n'.format(loginName))
    else:
      u = User(loginName)
      self.users[loginName] = u
      conn.user = u
      conn.send('{0}##login succeed! start chat.'.format(loginName))
  
  def createServer(self):
    server = socket(AF_INET, SOCK_STREAM)
    server.setblocking(False)
    server.bind(('127.0.0.1', 3001))
    server.listen(5)
    print('listen')

    try: 
      while True:
        try:
          sock, addr = server.accept()
          print('{0} connected.'.format(addr))
          sock.setblocking(False)
          conn = Connection(sock)
          self.connects.append(conn)
        except BlockingIOError as e:
          pass

        for conn in self.connects:
            conn.greeting()
            req = ''
            try:
              req = conn.receive()
            except:
              # print('conn error', traceback.format_exc())
              pass

            if not req:
              continue
            req = re.sub(r'\n|\r\n/', '', req.decode())
            # print('req:', req)
            (name, msg) = ('', req)
            if msg.find('##') >= 0:
              [name, msg] = msg.split('##')

            if msg == 'QUIT':
              self.quit(conn)
            elif name:
              # 已登录
              if msg:
                self.broadcast('{0} said: {1}'.format(name, msg), name)
            elif msg.startswith('LOGIN'):
                # 登录
                [_, loginName] = msg.split(' ')
                self.login(loginName, conn)
            else:
              # 未登录
              print('未登录')
    except:
        print('client error', traceback.format_exc())
        sock.close()
        server.close()
  
def __main():
  s = Server()

__main()