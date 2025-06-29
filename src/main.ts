import 'reflect-metadata';

import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import bootstrap from './core/bootstrap';
import { registerRoutes } from './core/routers/router';

async function main() {
  dotenv.config();

  const app = fastify({ logger: true });
  const PORT = parseInt(process.env.PORT || '3000');

  await app.register(cors);

  bootstrap();

  await registerRoutes(app);

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log('🚀 Server is running on port ' + PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error starting the server:', err);
  process.exit(1);
});
