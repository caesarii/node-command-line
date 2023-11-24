from socket import *
import sys
import traceback
import time

class Client:
  name = ''
  sock = None
  def __init__(self):
    self.connect()

  def receive(self):
    res = ''
    try:
      res = self.sock.recv(1024)
      # print('res:', res)
    except:
      pass

    # 处理响应
    if res:
      msg = res.decode()
      print(msg)
      if msg.find('##') >= 0:
        [name, msg] = msg.split('##')
        if name:
          self.name = name

  def send(self):
     # 发送用户输入:        
    userInput = sys.stdin.readline()
    self.sock.send(bytes('{0}##{1}'.format(self.name, userInput), 'utf-8'))

  def connect(self):
    sock = socket(AF_INET, SOCK_STREAM)
    self.sock = sock
    sock.connect(('127.0.0.1', 3000))
    sock.setblocking(False)
    print('connect succeed')

    try: 
      while True:
        self.receive()
        self.send()
    except:
        print('client error', traceback.format_exc())
        sock.close()
  
def __main():
  Client()

__main()
