const Hapi = require('@hapi/hapi');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: 5000 || process.env.PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(require('./src/routes/favorites'));
  await server.register(require('./src/routes/auth'));
  await server.register(require('./src/routes/foods'));
  await server.register(require('./src/routes/ratings'));

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
