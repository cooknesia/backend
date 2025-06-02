const fs = require('fs');
const path = require('path');
const Hapi = require('@hapi/hapi');
const logRequest = require('./src/utils/logRequest');

// swagger js
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
//

require('dotenv').config();

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
      state: {
        parse: false,  // <--- ini mematikan parsing cookie
        failAction: 'ignore', // atau 'log' jika ingin log tapi lanjut
      },
    },
  });

  // Add COOP and COEP headers via onPreResponse extension
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return h.continue;
    }
    response.header('Cross-Origin-Opener-Policy', 'same-origin');
    response.header('Cross-Origin-Embedder-Policy', 'require-corp');
    return h.continue;
  });

  const swaggerOptions = {
    info: {
      title: 'Cooknesia API Documentation',
      version: Pack.version,
    },
    grouping: 'tags',  
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { method, path } = request;
    const statusCode = request.response?.statusCode || 500;
    logRequest(method, path, statusCode);
    return h.continue;
  });

  const routesDir = path.join(__dirname, 'src', 'routes');
  const routeFiles = fs.readdirSync(routesDir).filter((file) => file.endsWith('.js'));

  for (const file of routeFiles) {
    const route = require(path.join(routesDir, file));
    await server.register(route);
  }

  await server.start();
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on %s`,
    server.info.uri,
  );
})();
