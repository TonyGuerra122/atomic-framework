import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { IMiddleware } from '../../interfaces/middleware.interface';
import { getGlobalMiddlewares } from '../decorators/middleware';
import { getControllers, RouteDefinition } from '../decorators/controller';
import { Constructor } from '../di/types';
import { resolve } from '../decorators/decorator.resolver';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  const globalMiddlewares = getGlobalMiddlewares();

  for (const controllerInstance of getControllers()) {
    const controllerClass = controllerInstance.constructor as Constructor;
    const basePath: string = Reflect.getMetadata('basePath', controllerClass);
    const routes: RouteDefinition[] =
      Reflect.getMetadata('routes', controllerClass) || [];

    for (const route of routes) {
      const fullPath = (basePath + route.path).replace(/\/+/g, '/');
      const method = route.method;

      const handler = controllerInstance[
        route.handlerName as keyof typeof controllerInstance
      ] as (req: FastifyRequest, reply: FastifyReply) => void | Promise<void>;

      const preHandlers: Array<
        (req: FastifyRequest, reply: FastifyReply) => void | Promise<void>
      > = [];

      for (const { condition, middleware } of globalMiddlewares) {
        const instance = resolve(middleware) as IMiddleware;

        if (condition.type === 'pattern') {
          const pattern = condition.value;
          let includeMatch = false;
          let excludeMatch = false;

          if (typeof pattern === 'string' || Array.isArray(pattern)) {
            includeMatch = Array.isArray(pattern)
              ? pattern.includes(fullPath)
              : new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(
                  fullPath,
                );
          } else {
            const { include, exclude } = pattern;

            includeMatch = Array.isArray(include)
              ? include.some((p) =>
                  new RegExp('^' + p.replace(/\*/g, '.*') + '$').test(fullPath),
                )
              : new RegExp('^' + include.replace(/\*/g, '.*') + '$').test(
                  fullPath,
                );

            excludeMatch = Array.isArray(exclude)
              ? exclude.some((p) =>
                  new RegExp('^' + p.replace(/\*/g, '.*') + '$').test(fullPath),
                )
              : new RegExp(
                  '^' + (exclude || '').replace(/\*/g, '.*') + '$',
                ).test(fullPath);
          }

          if (includeMatch && !excludeMatch) {
            preHandlers.push(instance.handle.bind(instance));
          }
        } else if (condition.type === 'watcher') {
          const { path, method: watcherMethod } = condition.value;

          if (
            fullPath === path &&
            method.toLowerCase() === watcherMethod.toLowerCase()
          ) {
            preHandlers.push(instance.handle.bind(instance));
          }
        }
      }

      if (route.middlewares?.length) {
        preHandlers.push(...route.middlewares);
      }

      app.route({
        method: method as HttpMethod,
        url: fullPath,
        handler,
        preHandler: preHandlers.length > 0 ? preHandlers : undefined,
      });

      console.log(`[Fastify] ${method.toUpperCase()} ${fullPath} registrado`);
    }
  }
}
