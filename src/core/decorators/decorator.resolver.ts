import { Constructor } from '../di/types';
import { getInjectable, saveInjectableIfNoExists } from './injectable';
import { getRepository, saveRepositoryIfNoExists } from './repository';
import { getService, saveServiceIfNoExists } from './service';

export function resolve<T>(target: Constructor<T>): T {
  const paramTypes: Constructor[] =
    Reflect.getOwnMetadata('design:paramtypes', target) || [];

  const injectTokens: Map<number, string> =
    Reflect.getOwnMetadata('inject:token', target.prototype) || new Map();

  const dependencies = paramTypes.map((param, index) => {
    const token = injectTokens.get(index);
    const name = token || param.name;

    // Evita resolver tipos primitivos
    if (!param || typeof param !== 'function' || param.name === 'Object') {
      throw new Error(
        `Cannot resolve dependency at index ${index} for ${target.name}`,
      );
    }

    // Busca instância já existente
    const existingInstance =
      getService(name) || getRepository(name) || getInjectable(name);

    if (existingInstance) return existingInstance;

    // Cria nova instância recursivamente
    const newInstance = resolve(param);

    // Salva nos registries
    saveServiceIfNoExists(name, newInstance);
    saveRepositoryIfNoExists(name, newInstance);
    saveInjectableIfNoExists(name, newInstance);

    return newInstance;
  });

  return new target(...dependencies);
}
