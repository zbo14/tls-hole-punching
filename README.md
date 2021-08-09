# tls-hole-punching

Demo: TCP hole-punching with TLS for direct, reliable, and secure peer-to-peer communication.

## Install

Clone the repo, `asdf install`, `npm i -g node-gyp` (if it isn't installed already), and `npm i`.

You can download asdf [here](https://asdf-vm.com/guide/getting-started.html#_2-download-asdf). While it's not absolutely necessary, the code samples are not guaranteed to work with versions of Node and Python other than those specified in `.tool-versions`.

## Usage

Make sure you've completed the install process on 2 machines on different networks. You should have shell access to both machines.

You shouldn't add "allow rules" to either network firewall for the purposes of this demo.

For the following commands, assume machine A has public IPv4 address "1.2.3.4" and machine B is "5.6.7.8".

On success, you should see "hello world" written to stdout on both machines.

### Node example

#### On machine A

`npm run hello-node 5.6.7.8 true`

#### On machine B

`npm run hello-node 1.2.3.4`

### Python example

#### On machine A

`npm run hello-python 5.6.7.8 true`

#### On machine B

`npm run hello-python 1.2.3.4`
