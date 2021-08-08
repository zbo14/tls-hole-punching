'use strict'

const EventEmitter = require('events')
const fs = require('fs')
const net = require('net')
const path = require('path')
const tls = require('tls')

const privateDir = path.join(__dirname, 'private')

const main = async () => {
  const remoteIp = process.argv[2].trim()
  const isServer = (process.argv[3] || '').trim().toLowerCase() === 'true'
  const sock = net.connect(54312, remoteIp)

  await EventEmitter.once(sock, 'connect')

  let tlsSock

  if (isServer) {
    const [cert, key] = await Promise.all([
      fs.promises.readFile(path.join(privateDir, 'cert.pem')),
      fs.promises.readFile(path.join(privateDir, 'key.pem'))
    ])

    tlsSock = new tls.TLSSocket(sock, {
      isServer,
      cert,
      key,
      rejectUnauthorized: false
    })
  } else {
    tlsSock = new tls.TLSSocket(sock, {
      isServer,
      rejectUnauthorized: false
    })
  }

  tlsSock
    .setEncoding('utf8')
    .on('data', console.log)
    .on('error', console.error)
    .write('hello world')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
