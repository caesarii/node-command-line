from socket import *
import sys

class Client:
  def __init__(self):
    self.socket = self.connect()
    self.name = ''

  def connect(self):
    cSocket = socket(AF_INET, SOCK_STREAM)
    cSocket.connect(('127.0.0.1', 3001))
    sys.stdout.write('connect succeed\r\n')
    while True:
      # cSocket.send(bytes(data, 'utf-8'))
      data = cSocket.recv(1024)
      if not data:
        break
      data = data.decode('utf-8')

      # print('heqy res', data)
      if data.find('##') >= 0:
        [name, msg] = data.split('##')
        if name:
          self.name = name
        
        sys.stdout.write(msg)

      input = sys.stdin.readline()
      cSocket.send(bytes(input, 'utf-8'))


    return cSocket

  
def __main():
  c = Client()
  c.connect

__main()
