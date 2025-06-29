import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

import { registerRoutes } from './routers/router';

export default class App {
  private static readonly _HOST = '0.0.0.0';

  private readonly _app: FastifyInstance;

  constructor() {
    this._app = fastify({ logger: true });
  }

  public async init(): Promise<void> {
    await this._app.register(cors);
    await registerRoutes(this._app);
  }

  public async listen(port: number): Promise<void> {
    await this._app.listen({ port, host: App._HOST });
    console.log(`🚀 Server running on http://localhost:${port}`);
  }

  public get app(): FastifyInstance {
    return this._app;
  }
}
