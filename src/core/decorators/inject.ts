import 'reflect-metadata';

export function Inject(key: string): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existing: Map<number, string> = Reflect.getOwnMetadata(
      'inject:token',
      target,
    );

    existing.set(parameterIndex, key);
    Reflect.defineMetadata('inject:token', existing, target);
  };
}
