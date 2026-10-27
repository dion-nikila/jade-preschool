import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};
const port = Number(process.env.PORT || 4173);
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const decoded = decodeURIComponent(url.pathname);
      let f = path.resolve(root, "." + decoded);
      if (f !== root && !f.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      const s = await stat(f);
      if (s.isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          res
            .writeHead(301, { Location: url.pathname + "/" + url.search })
            .end();
          return;
        }
        f = path.join(f, "index.html");
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(f)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(await readFile(f));
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(await readFile(path.join(root, "404.html")));
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Local: http://127.0.0.1:${port}`),
  );
