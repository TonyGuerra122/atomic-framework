import { Constructor } from '../di/types';
import { resolve } from './decorator.resolver';

const SERVICES = new Map<string, object>();

export function Service<T extends object>(name?: string): ClassDecorator {
  return (target: Function) => {
    const key = name || target.name;

    if (!SERVICES.has(key)) {
      const instance = resolve(target as Constructor<T>);

      SERVICES.set(key, instance);
    }
  };
}

export function getService<T extends object>(key: string): T | null {
  const instance = SERVICES.get(key);

  return (instance as T) || null;
}

export function saveServiceIfNoExists(name: string, instance: object): void {
  if (!SERVICES.has(name)) {
    SERVICES.set(name, instance);
  }
}

export function clearServices(): void {
  SERVICES.clear();
}
