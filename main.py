import os
import socket
import ssl
import sys

def main():
    remote_ip = sys.argv[1].strip()
    server_side = (sys.argv[2].strip().lower() or '') == 'true'
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    sock.bind(('', 54312))
    sock.connect((remote_ip, 54312))

    proto = ssl.PROTOCOL_TLS_SERVER if server_side else ssl.PROTOCOL_TLS_CLIENT
    context = ssl.SSLContext(proto)

    if server_side:
        private_dir = os.path.join(os.path.dirname(__file__), 'private')

        context.load_cert_chain(
            os.path.join(private_dir, 'cert.pem'),
            os.path.join(private_dir, 'key.pem')
        )

    else:
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

    tls_sock = context.wrap_socket(sock=sock, server_side=server_side)

    tls_sock.send(b'hello')
    msg = tls_sock.recv(5)

    print(msg.decode())

main()
