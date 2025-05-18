const Hapi = require('@hapi/hapi');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
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
  await server.register(require('./src/routes/recommendations'));
  await server.register(require('./src/routes/ingredients'));

  await server.start();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on %s`, server.info.uri);
};

init();
