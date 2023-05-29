import http.server
import socketserver
import ssl

PORT = 8421
DIRECTORY = "src"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    ctx = ssl.SSLContext(protocol=ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(certfile="cert.pem", keyfile="key.pem")
    with ctx.wrap_socket(httpd.socket, server_side=True) as wrap:
        httpd.socket = wrap
        print("Server started at https://localhost:" + str(PORT))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye")
