from socket import *
import sys
import traceback
import time

class Client:
  name = ''
  sock = None
  def __init__(self):
    self.connect()

  def connect(self):
    cSocket = socket(AF_INET, SOCK_STREAM)
    cSocket.connect(('127.0.0.1', 3001))
    cSocket.setblocking(False)
    print('connect succeed')

    try: 
      while True:
        res = ''
        try:
          res = cSocket.recv(1024)
          print('res:', res)
        except:
          pass

        # 打印响应
        if res:
          msg = res.decode()
          print( msg)
          if msg.find('##') >= 0:
            [name, msg] = msg.split('##')
            if name:
              self.name = name
        # 发送用户输入:        
        userInput = sys.stdin.readline()
        cSocket.send(bytes('{0}##{1}'.format(self.name, userInput), 'utf-8'))
    except:
        print('client error', traceback.format_exc())
        cSocket.close()
  
def __main():
  Client()

__main()
