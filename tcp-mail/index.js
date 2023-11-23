const net = require('net');
const assert = require('assert');
const fs = require('fs')

const log = console.log;

const config = {

  fromAddress: 'a869115421@163.com',
  toAddress: 'iwangqinghe@163.com',
  authcode: 'IKAQRIULDIVAQHEI',
  subject: '邮件主题',
};

const CommandType = {
  // SMTP
  EHLO: 'EHLO',
  AUTH_LOGIN: 'AUTH LOGIN',
  MAIL_FROM: 'MAIL FROM',
  RCPT_TO: 'RCPT TO',
  DATA: 'DATA',
  QUIT: 'QUIT',
  // pop3
  USER: 'USER', 
  PASS: 'PASS',
  STAT: 'STAT',
  RETR: 'RETR'
};

function toBase64(str) {
  const r = Buffer.from(str, 'utf8').toString('base64');
  log('r', r)
  return r;
}

class Mail {
  constructor() {
    this.socket = null
    this.sendCommand = this.sendCommand.bind(this)
    this.sendMailContent = this.sendMailContent.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.send =  this.send.bind(this)
    this.receive = this.receive.bind(this)
  }

  createConnect(host, port) {
    const self = this
    return new Promise(function (resolve, reject) {
      const socket = net.connect(port, host);
      socket.setEncoding('utf8');
      self.socket = socket
      socket.on('connect', function () {
        log('connect succeed')
        resolve(socket)
      });
    });
  }

  getStatus() {
    const socket = this.socket
    return new Promise(function (resolve, reject) {
      // getStatus 会重复调用, 这里用 once
      socket.once('data', function (res) {
        log('response:', res.toString());
        const code = res.slice(0, 3);
        resolve({ code, response: res });
      });
    });
  }

  async send() {
    const { sendCommand, sendMailContent, getStatus: getStatus } = this

    let res = await getStatus();
    assert(res.code === '220');

    sendCommand(`${CommandType.EHLO} Heqy`);
    res = await this.getStatus();
    assert(res.code === '250');


    sendCommand(CommandType.AUTH_LOGIN);
    res = await this.getStatus();
    assert(res.code === '334');

    sendCommand(toBase64(config.fromAddress));
    res = await this.getStatus();
    assert(res.code === '334');

    sendCommand(toBase64(config.authcode));
    res = await this.getStatus();
    assert(res.code === '235');

    sendCommand(`${CommandType.MAIL_FROM}:<${config.fromAddress}>`);
    res = await this.getStatus();
    assert(res.code === '250');

    sendCommand(`${CommandType.RCPT_TO}:<${config.toAddress}>`);
    res = await this.getStatus();
    assert(res.code === '250');

    sendCommand(CommandType.DATA);
    res = await this.getStatus();
    assert(res.code === '354');

    sendMailContent(
      config.subject,
      config.fromAddress,
      config.toAddress,
      'hello world'
    );
    res = await this.getStatus();
    assert(res.code === '250');

    sendCommand(CommandType.QUIT);
  }

  sendCommand(msg) {
    this.socket.write(`${msg}\r\n`);
  }
  
  sendMailContent(subject, fromAddress, toAddress, text) {
    this.socket.write(
      `SUBJECT:${subject}\r\nFROM:${fromAddress}\r\nTO:${toAddress}\r\n\r\n${text}\r\n.\r\n`
    );
  }


  async receive() {
    const { sendCommand, sendMailContent, getStatus } = this

    let res = await getStatus();
    assert(res.code === '+OK');

    sendCommand(`USER ${config.fromAddress}`);
    res = await getStatus();
    assert(res.code === '+OK');


    sendCommand(`PASS ${config.authcode}`);
    res = await getStatus();
    assert(res.code === '+OK');

    sendCommand(`STAT`);
    res = await getStatus();
    assert(res.code === '+OK');

    sendCommand(`RETR 6`);
    const { response } = await getStatus();
    this.saveMail(response)
  }

  saveMail(reponse) {
    fs.writeFile('./mail.html', reponse, function() {
      log('save mail succeed')
    })
  }
}

async function __main() {
  const mail = new Mail()
  // 发送邮件
  await mail.createConnect( 'smtp.163.com', 25)
  await mail.send();

  // 接收邮件
  // await mail.createConnect('pop.163.com','110')
  // await mail.receive()
}

__main();
