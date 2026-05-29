#!/usr/bin/env python3
"""Local dev server — no browser cache for html/css/js."""

import http.server
import socketserver

PORT = 8080


class DevHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split("?")[0]
        if path.endswith((".html", ".css", ".js")) or path in ("/", "/index.html"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), DevHandler) as httpd:
        print(f"Dev server → http://localhost:{PORT}/new.html")
        print(f"Phone       → http://<your-ip>:{PORT}/new.html")
        print("Cache disabled for .html .css .js — one refresh is enough")
        httpd.serve_forever()
