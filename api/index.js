const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const logRequest = require('../src/utils/logRequest');

let server;

const createServer = async () => {
  if (server) return server;

  server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: { origin: ['*'] },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { method, path } = request;
    const statusCode = request.response?.statusCode || 500;
    logRequest(method, path, statusCode);
    return h.continue;
  });

  const routesDir = path.join(__dirname, '..', 'src', 'routes');
  const routeFiles = fs.readdirSync(routesDir).filter((file) => file.endsWith('.js'));

  for (const file of routeFiles) {
    const route = require(path.join(routesDir, file));
    await server.register(route);
  }

  return server;
};

module.exports = async (req, res) => {
  const server = await createServer();

  await server
    .inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers,
    })
    .then((response) => {
      res.statusCode = response.statusCode;
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value);
      }
      res.end(response.rawPayload);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.end(err.message);
    });
};
