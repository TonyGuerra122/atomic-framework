import 'reflect-metadata';
import { Constructor } from '../di/types';
import { resolve } from './decorator.resolver';

const INJECTABLES = new Map<string, object>();

export function Injectable<T extends object>(name?: string): ClassDecorator {
  return (target: Function) => {
    const key = name || target.name;

    if (!INJECTABLES.has(key)) {
      const instance = resolve(target as Constructor<T>);

      INJECTABLES.set(key, instance);
    }
  };
}

export function getInjectable<T extends object>(key: string): T | null {
  const instance = INJECTABLES.get(key);

  return (instance as T) || null;
}

export function saveInjectableIfNoExists(name: string, instance: object): void {
  if (!INJECTABLES.has(name)) {
    INJECTABLES.set(name, instance);
  }
}

export function clearInjectables(): void {
  INJECTABLES.clear();
}
