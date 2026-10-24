"""Revision 0.1 | 2026-10-24 | Codex | Added a local static server for the project dashboard."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import os


def main() -> None:
    """Serve the sub project directory for native browser modules."""
    root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description="Serve the TWRP C3B2 submittal dashboard.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    os.chdir(root)
    server = ThreadingHTTPServer((args.host, args.port), SimpleHTTPRequestHandler)
    print(f"Serving {root} at http://{args.host}:{args.port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
