import 'reflect-metadata';

export function Env(key: string): PropertyDecorator {
  return (target, propertyKey) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const raw = process.env[key];

    if (raw === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }

    let value: unknown;

    if (type === Number) {
      value = Number(raw);
    } else if (type === Boolean) {
      value = raw.toLowerCase() === 'true';
    }

    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      enumerable: true,
      configurable: true,
    });
  };
}
