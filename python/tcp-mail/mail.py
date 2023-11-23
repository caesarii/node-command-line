from socket import *
import traceback
import base64

log = print

config = {
  'fromAddress': 'a869115421@163.com',
  'toAddress': 'iwangqinghe@163.com',
  'authcode': 'IKAQRIULDIVAQHEI',
  'subject': '邮件主题',
}


CommandType = {
  # SMTP
  'EHLO': 'EHLO',
  'AUTH_LOGIN': 'AUTH LOGIN',
  'MAIL_FROM': 'MAIL FROM',
  'RCPT_TO': 'RCPT TO',
  'DATA': 'DATA',
  'QUIT': 'QUIT',
  # pop3
  'USER': 'USER', 
  'PASS': 'PASS',
  'STAT': 'STAT',
  'RETR': 'RETR'
};


class Mail: 
  sock = None

  def createConnect(self, host, port):
    sock = socket(AF_INET, SOCK_STREAM)
    sock.connect((host, port))
    self.sock = sock

  def getResponse(self):
    print('getResponse')
    while True:
      res = self.sock.recv(2048)
      if res:
        res = res.decode('utf-8')
        print(res)
        code = res[0:3]
        return ( code, res )
  
  def sendCommand(self, msg):
    self.sock.send(bytes('{0}\r\n'.format(msg), 'utf-8'))
  
  def sendBase64(self, msg):
   r = base64.b64encode(msg.encode())
   r = (r.decode() + '\r\n').encode()
   log('r', r)
   self.sock.send(r)

  def sendMailContent(self, subject, fromAddress, toAddress, text):
    self.sock.send(
      'SUBJECT:{0}\r\nFROM:{1}\r\nTO:{2}\r\n\r\n{3}\r\n.\r\n'.format(
        subject,
        fromAddress,
        toAddress,
        text
      ).encode()
    );

  def send(self): 

    ( code, res ) = self.getResponse()
    assert code == '220', '没准备好'

    self.sendCommand('{0} heqy'.format(CommandType['EHLO']))
    ( code, res ) = self.getResponse()
    assert code == '250', 'EHLO failed'

    self.sendCommand(CommandType['AUTH_LOGIN'])
    ( code, res ) = self.getResponse()
    assert code == '334', 'AUTH_LOGIN failed'

    self.sendBase64(config['fromAddress'])
    ( code, res ) = self.getResponse()
    assert code == '334', 'AUTH_LOGIN:fromAddress failed'

    self.sendBase64(config['authcode'])
    ( code, res ) = self.getResponse()
    assert code == '235', 'AUTH_LOGIN:authcode failed'


    self.sendCommand('{0}:<{1}>'.format(CommandType['MAIL_FROM'], config['fromAddress']))
    ( code, res ) = self.getResponse()
    assert code == '250', 'MAIL_FROM failed'

    self.sendCommand('{0}:<{1}>'.format(CommandType['RCPT_TO'], config['toAddress']))
    ( code, res ) = self.getResponse()
    assert code == '250', 'RCPT_TO failed'


    self.sendCommand(CommandType['DATA'])
    ( code, res ) = self.getResponse()
    assert code == '354', 'DATA failed'

    self.sendMailContent( 
      config['subject'],
      config['fromAddress'],
      config['toAddress'],
      'hello world')
    ( code, res ) = self.getResponse()
    assert code == '250', 'sendMailContent failed'

    self.sendCommand(CommandType['QUIT'])

  def receive(self):
    ( code, res ) = self.getResponse()
    assert code == '+OK', '没准备好'

    self.sendCommand('{0} {1}'.format(CommandType['USER'], config['fromAddress']))
    ( code, res ) = self.getResponse()
    assert code == '+OK', 'USER failed'

    self.sendCommand('{0} {1}'.format(CommandType['PASS'], config['authcode']))
    ( code, res ) = self.getResponse()
    assert code == '+OK', 'PASS failed'


    self.sendCommand(CommandType['STAT'])
    ( code, res ) = self.getResponse()
    assert code == '+OK', 'STAT failed'


    self.sendCommand('{0} 6'.format(CommandType['RETR']))
    ( code, res ) = self.getResponse()
    self.saveMail(res)

  def saveMail(self, response):
    output = open('mail.html', 'w')
    output.write(response)

def __main():
  try:

    mail = Mail()
    # 发送邮件
    # mail.createConnect( 'smtp.163.com', 25)
    # mail.send();

    # 接收邮件
    mail.createConnect('pop.163.com', 110)
    mail.receive()
  except:
    print(traceback.format_exc())


__main()