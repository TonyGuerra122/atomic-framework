import 'reflect-metadata';
import { Constructor } from '../di/types';

export interface MiddlewaresWatcher {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

export type MiddlewarePattern =
  | string
  | string[]
  | {
      include: string | string[];
      exclude?: string | string[];
    };

export type MiddlewareCondition =
  | { type: 'pattern'; value: MiddlewarePattern }
  | { type: 'watcher'; value: MiddlewaresWatcher };

const REGISTERED_MIDDLEWARES: {
  condition: MiddlewareCondition;
  middleware: Constructor;
}[] = [];

export function Middleware(
  condition: MiddlewarePattern | MiddlewaresWatcher,
): ClassDecorator {
  return (target) => {
    let finalCondition: MiddlewareCondition;

    if (
      typeof condition === 'string' ||
      Array.isArray(condition) ||
      'include' in condition
    ) {
      finalCondition = {
        type: 'pattern',
        value: condition as MiddlewarePattern,
      };
    } else {
      finalCondition = {
        type: 'watcher',
        value: condition as MiddlewaresWatcher,
      };
    }

    REGISTERED_MIDDLEWARES.push({
      condition: finalCondition,
      middleware: target as unknown as Constructor,
    });
  };
}

export function getGlobalMiddlewares(): {
  condition: MiddlewareCondition;
  middleware: Constructor;
}[] {
  return REGISTERED_MIDDLEWARES;
}
