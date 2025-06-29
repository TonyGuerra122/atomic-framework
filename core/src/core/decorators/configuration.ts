import 'reflect-metadata';
import { Constructor } from '../di/types';
import { getAllAtomics } from './atomic';
import { resolve } from './decorator.resolver';
import { saveInjectableIfNoExists } from './injectable';

export function Configuration(): ClassDecorator {
  return (target: Function) => {
    const configInstance = resolve(target as unknown as Constructor);
    const atoms = getAllAtomics();

    const instanceWithMethods = configInstance as Record<
      string,
      (...args: unknown[]) => unknown
    >;

    for (const [targetPrototype, methodNames] of atoms) {
      if (Object.getPrototypeOf(configInstance) !== targetPrototype) continue;

      for (const methodName of methodNames) {
        const method = instanceWithMethods[methodName]?.bind(configInstance);

        if (!method) continue;

        const result = method();

        const atomicName = Reflect.getMetadata(
          'atomic:name',
          targetPrototype,
          methodName,
        );

        if (result !== undefined && result !== null) {
          saveInjectableIfNoExists(atomicName, result);
        }
      }
    }
  };
}
