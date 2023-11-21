from socket import *
import sys

class Client:
  name = ''
  sock = None
  def __init__(self):
    self.connect()

  def connect(self):
    cSocket = socket(AF_INET, SOCK_STREAM)
    cSocket.connect(('127.0.0.1', 3000))
    sys.stdout.write('connect succeed\r\n')

    try: 
        
      while True:
        # cSocket.send(bytes(data, 'utf-8'))
        res = cSocket.recv(1024)
        if not res:
          break
        msg = res.decode('utf-8')

        print('msg', msg)
        if msg.find('##') >= 0:
          [name, msg] = msg.split('##')
          if name:
            self.name = name
          
        sys.stdout.write(msg)

        input = sys.stdin.readline()
        cSocket.send(bytes('{0}##{1}'.format(self.name, input), 'utf-8'))
    except KeyboardInterrupt:
        cSocket.close()
  
def __main():
  Client()

__main()
