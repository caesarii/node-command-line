const net = require("net");
const assert = require("assert");

const log = console.log;

const config = {
  host: "smtp.163.com",
  port: 25,
  fromAddress: "a869115421@163.com",
  toAddress: "iwangqinghe@163.com",
  authcode: "IKAQRIULDIVAQHEI",
  subject: "邮件主题",
};

const CommandType = {
  HELO: "HELO",
  AUTH_LOGIN: "AUTH LOGIN",
  MAIL_FROM: "MAIL FROM",
  RCPT_TO: "RCPT TO",
  DATA: "DATA",
  QUIT: "QUIT",
};

function toBase64(str) {
  const r = Buffer.from(str, "utf8").toString("base64");
  return r;
}



class SMTP {
  constructor() {
    this.socket = null
    this.sendCommand = this.sendCommand.bind(this)
    this.sendMailContent = this.sendMailContent.bind(this)
    this.getData = this.getStatus.bind(this)
  }

  createConnect(host, port) {
    const self = this
    return new Promise(function (resolve, reject) {
      const socket = net.connect(port, host);
      socket.setEncoding("utf8");
      self.socket = socket
      socket.on("connect", function () {
        log('connect succeed')
        resolve(socket)
      });
    });
  }

  getStatus() {
    const socket = this.socket
    return new Promise(function (resolve, reject) {
      // getStatus 会重复调用, 这里用 once
      socket.once("data", function (res) {
        log("response:", res.toString());
        const statusCode = res.slice(0, 3);
        resolve(statusCode, res);
      });
    });
  }

  async send() {
    const { sendCommand, sendMailContent, getStatus: getData } = this

    let code = await getData();
    assert(code === "220");
    sendCommand(`${CommandType.HELO} Heqy`);
  
    code = await this.getStatus();
    assert(code === "250");
    sendCommand(CommandType.AUTH_LOGIN);
  
    code = await this.getStatus();
    assert(code === "334");
    sendCommand(toBase64(config.fromAddress));
  
    code = await this.getStatus();
    assert(code === "334");
    sendCommand(toBase64(config.authcode));
  
    code = await this.getStatus();
    assert(code === "235");
    sendCommand(`${CommandType.MAIL_FROM}:<${config.fromAddress}>`);
  
    code = await this.getStatus();
    assert(code === "250");
    sendCommand(`${CommandType.RCPT_TO}:<${config.toAddress}>`);
  
    code = await this.getStatus();
    assert(code === "250");
    sendCommand(CommandType.DATA);
  
    code = await this.getStatus();
    assert(code === "354");
    sendMailContent(
      config.subject,
      config.fromAddress,
      config.toAddress,
      "hello world"
    );
  
    code = await this.getStatus();
    assert(code === "250");
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
}

async function __main() {
  const smtp = new SMTP()
  await smtp.createConnect(config.host, config.port)
  await smtp.send();
}

__main();
