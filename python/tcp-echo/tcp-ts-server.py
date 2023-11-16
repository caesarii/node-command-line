from socket import *
from time import ctime

config = {
  'HOST': '127.0.0.1',
  'PORT': 3000,
  'BUFSIZ': 1024,
}

tcpSocket = socket(AF_INET, SOCK_STREAM)
tcpSocket.bind((config['HOST'], config['PORT']))
tcpSocket.listen(5)

try: 
  while True:
    print('waiting for connection...')
    clientSocket, addr = tcpSocket.accept()
    print('...connected from:', addr)

    try: 
      while True:
          data = clientSocket.recv(config['BUFSIZ'])
          if not data:
            break
          res = '{time} {data}'.format(time = ctime(), data = data)
          btRes = bytes(res, 'utf-8')
          print('res {0}\r\n'.format(btRes))
          clientSocket.send(btRes)
      clientSocket.close()
    except TypeError:
      print('error close\r\n')
      clientSocket.close()
      tcpSocket.close()
except KeyboardInterrupt:
  print('KeyboardInterrupt\r\n')
  tcpSocket.close()

