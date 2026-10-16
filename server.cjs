'use strict';

// Local-only server for the public PWA and its existing Node API handlers.
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const {pipeline} = require('node:stream/promises');

const ROOT = __dirname;
const API_FILES = new Map([
  ['/api/restaurants', './api/restaurants.js'],
  ['/api/maps-config', './api/maps-config.js'],
  ['/api/restaurant-photo', './api/restaurant-photo.js'],
  ['/api/movies', './api/movies.js'],
  ['/api/movie-details', './api/movie-details.js'],
  ['/api/movie-platforms', './api/movie-platforms.js'],
  ['/api/blog', './api/blog.js']
]);
const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'], ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'], ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'], ['.gif', 'image/gif'], ['.ico', 'image/x-icon'],
  ['.avif', 'image/avif'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'], ['.eot', 'application/vnd.ms-fontobject'],
  ['.mp3', 'audio/mpeg'], ['.mp4', 'video/mp4'], ['.ogg', 'audio/ogg'],
  ['.wav', 'audio/wav'], ['.wasm', 'application/wasm'], ['.glb', 'model/gltf-binary'],
  ['.usdz', 'model/vnd.usdz+zip'], ['.bin', 'application/octet-stream'],
  ['.onnx', 'application/octet-stream'], ['.txt', 'text/plain; charset=utf-8']
]);
const PRIVATE_SEGMENTS = new Set(['api', 'lib', 'node_modules', 'scripts', 'test', 'tests', 'work']);
const PRIVATE_FILES = new Set(['package.json', 'package-lock.json', 'vercel.json']);

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

function send(req, res, status, message) {
  const body = Buffer.from(message + '\n');
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': body.length,
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
  });
  res.end(req.method === 'HEAD' ? undefined : body);
}

function pathnameOf(target) {
  if (typeof target !== 'string' || !target.startsWith('/')) return null;
  let pathname;
  try { pathname = decodeURIComponent(target.split('?')[0]); } catch { return null; }
  if (/[\\:\u0000-\u001f\u007f]/u.test(pathname)) return null;
  const segments = pathname.split('/');
  if (segments.some(segment => segment === '.' || segment === '..')) return null;
  return pathname;
}

function createServer() {
  const realRoot = fs.realpathSync(ROOT);
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const pathname = pathnameOf(req.url);
    if (pathname === null) return send(req, res, 400, 'Ruta no valida.');
    const apiFile = API_FILES.get(pathname);
    if (apiFile) {
      // Each handler keeps its own allowed methods and same-origin checks.
      // HEAD follows GET while omitting the response body.
      if (req.method === 'HEAD') {
        req.method = 'GET';
        const end = res.end.bind(res);
        res.end = function(_body, encoding, callback) {
          return end(undefined, typeof encoding === 'function' ? encoding : callback);
        };
      }
      try { await require(apiFile)(req, res); }
      catch {
        console.error('[MAROHE] No se pudo completar una solicitud API.');
        if (!res.headersSent) send(req, res, 500, 'No se pudo completar la solicitud.');
        else if (!res.writableEnded) res.end();
      }
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return send(req, res, 405, 'Metodo no permitido.');
    }
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.') || PRIVATE_SEGMENTS.has(segment.toLowerCase())) || PRIVATE_FILES.has(segments.at(-1)?.toLowerCase())) {
      return send(req, res, 404, 'No encontrado.');
    }
    const publicPath = pathname === '/' ? '/index.html' : ['/restaurantes', '/restaurantes/'].includes(pathname) ? '/restaurantes/index.html' : ['/peliculas', '/peliculas/'].includes(pathname) ? '/peliculas/index.html' : pathname;
    const filePath = path.resolve(ROOT, '.' + publicPath);
    const contentType = MIME.get(path.extname(filePath).toLowerCase());
    if (!inside(ROOT, filePath) || !contentType) return send(req, res, 404, 'No encontrado.');
    try {
      const realPath = await fsp.realpath(filePath);
      if (!inside(realRoot, realPath)) return send(req, res, 404, 'No encontrado.');
      // Check the resolved path too: a public symlink must never expose private source.
      const realSegments = path.relative(realRoot, realPath).split(path.sep);
      if (realSegments.some(segment => segment.startsWith('.') || PRIVATE_SEGMENTS.has(segment.toLowerCase())) || PRIVATE_FILES.has(realSegments.at(-1)?.toLowerCase()) || !MIME.has(path.extname(realPath).toLowerCase())) {
        return send(req, res, 404, 'No encontrado.');
      }
      const stat = await fsp.stat(realPath);
      if (!stat.isFile()) return send(req, res, 404, 'No encontrado.');
      res.writeHead(200, {'Content-Type': contentType, 'Content-Length': stat.size, 'Cache-Control': 'no-cache'});
      if (req.method === 'HEAD') return res.end();
      await pipeline(fs.createReadStream(realPath), res);
    } catch (error) {
      if (!res.headersSent) send(req, res, ['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code) ? 404 : 500, 'No encontrado.');
      else if (!res.writableEnded) res.destroy();
    }
  });
}

function start() {
  if (Number(process.versions.node.split('.')[0]) < 24) {
    console.error('MAROHE necesita Node.js 24 o posterior.');
    process.exitCode = 1; return;
  }
  const localEnv = path.join(ROOT, '.env.local');
  if (fs.existsSync(localEnv)) {
    try { process.loadEnvFile(localEnv); }
    catch { console.error('No se pudo leer .env.local. Revisa su formato.'); process.exitCode = 1; return; }
  }
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT debe ser un numero entre 1 y 65535.'); process.exitCode = 1; return;
  }
  const server = createServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} ya esta en uso. Cierra el otro servidor o cambia PORT.` : 'No se pudo iniciar el servidor local.');
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`MAROHE esta listo: http://127.0.0.1:${port}`);
    console.log(`Restaurantes: http://127.0.0.1:${port}/restaurantes/`);
    console.log(`Pelis: http://127.0.0.1:${port}/peliculas/`);
    console.log('Abre esa direccion en tu navegador. Ctrl+C para cerrar.');
  });
  return server;
}

if (require.main === module) start();
module.exports = {createServer, start};
