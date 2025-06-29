import { FastifyReply, FastifyRequest } from 'fastify';

import 'reflect-metadata';
import { resolve } from './decorator.resolver';
import { Constructor } from '../di/types';

const CONTROLLERS: object[] = [];

export type FastifyMiddleware = (
  req: FastifyRequest,
  reply: FastifyReply,
) => void | Promise<void>;

export interface RouteDefinition {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  handlerName: string | symbol;
  middlewares?: FastifyMiddleware[];
}

export function Controller(basePath: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('basePath', basePath, target);

    const instance = resolve(target as unknown as Constructor);

    CONTROLLERS.push(instance);
  };
}

function createRouteDecorator(method: RouteDefinition['method']) {
  return (
    path: string,
    ...middleware: FastifyMiddleware[]
  ): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
      const routes: RouteDefinition[] =
        Reflect.getMetadata('routes', target.constructor) || [];

      routes.push({
        method,
        path,
        handlerName: propertyKey,
        middlewares: middleware,
      });

      Reflect.defineMetadata('routes', routes, target.constructor);
    };
  };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');
export const Patch = createRouteDecorator('patch');

export function getControllers<T extends object>(): T[] {
  return CONTROLLERS as T[];
}
