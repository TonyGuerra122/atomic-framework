import { Constructor } from '../di/types';
import { resolve } from './decorator.resolver';

const REPOSITORIES = new Map<string, object>();

export function Repository<T extends object>(name?: string): ClassDecorator {
  return (target: Function) => {
    const key = name || target.name;

    if (!REPOSITORIES.has(key)) {
      const instance = resolve(target as Constructor<T>);

      REPOSITORIES.set(key, instance);
    }
  };
}

export function getRepository<T extends object>(key: string): T | null {
  const instance = REPOSITORIES.get(key);

  return (instance as T) || null;
}

export function saveRepositoryIfNoExists(name: string, instance: object): void {
  if (!REPOSITORIES.has(name)) {
    REPOSITORIES.set(name, instance);
  }
}
