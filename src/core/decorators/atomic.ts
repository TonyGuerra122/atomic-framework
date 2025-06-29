import 'reflect-metadata';
import { Constructor } from '../di/types';
import { resolve } from './decorator.resolver';
import { saveInjectableIfNoExists } from './injectable';

const CONFIGURATIONS = new Map<object, string[]>();

export function Atomic(name?: string): MethodDecorator {
  return (target, propertyKey, _) => {
    const configProperty = target;
    const methodName = propertyKey.toString();

    if (!CONFIGURATIONS.has(configProperty)) {
      CONFIGURATIONS.set(configProperty, []);
    }

    CONFIGURATIONS.get(configProperty)!.push(methodName);

    Reflect.defineMetadata(
      'atomic:name',
      name || methodName,
      target,
      propertyKey,
    );
  };
}

export function getAllAtomics(): Map<object, string[]> {
  return CONFIGURATIONS;
}

export function registerAtomics(): void {
  for (const [prototype, methods] of getAllAtomics()) {
    const clazz = prototype.constructor as Constructor;
    const instance = resolve(clazz);

    for (const method of methods) {
      const name = Reflect.getMetadata('atomic:name', prototype, method);
      const result = (instance as Record<string, Function>)[method]();
      saveInjectableIfNoExists(result, name);
    }
  }
}
