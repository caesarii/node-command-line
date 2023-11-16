from socket import *

config = {
  'HOST': '127.0.0.1',
  'PORT': 3000,
  'BUFSIZ': 1024,
}

clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((config['HOST'], config['PORT']))

while True:
  data = input('> ')
  if not data:
    break
  clientSocket.send(bytes(data, 'utf-8'))

  data = clientSocket.recv(config['BUFSIZ'])
  if not data:
    break
  print(data.decode('utf-8')+'\r\n')
clientSocket.close()