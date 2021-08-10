'use strict'

const EventEmitter = require('events')
const fs = require('fs')
const net = require('net')
const path = require('path')
const tls = require('tls')
const addon = require('bindings')('socket')

const privateDir = path.resolve(__dirname, '..', 'private')

const main = async () => {
  const remoteIp = process.argv[2].trim()
  const isServer = (process.argv[3] || '').trim().toLowerCase() === 'true'
  const fd = addon.bindSocket(54312)
  const sock = new net.Socket({ fd, readable: true, writable: true })

  sock.connect(54312, remoteIp)

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
      key
    })
  } else {
    tlsSock = new tls.TLSSocket(sock, { rejectUnauthorized: false })
  }

  let data = ''

  tlsSock
    .on('data', chunk => {
      data += chunk
    })
    .end('hello world')

  await EventEmitter.once(tlsSock, 'end')

  console.log(data)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
