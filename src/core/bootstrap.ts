import path from 'path';

import { loadModulesFrom } from '../utils/module.util';
import { registerAtomics } from './decorators/atomic';

export default function bootstrap(): void {
  const basePath = path.resolve(process.cwd(), 'src');

  loadModulesFrom(path.join(basePath, 'configurations'));
  loadModulesFrom(path.join(basePath, 'repositories'));
  loadModulesFrom(path.join(basePath, 'services'));
  loadModulesFrom(path.join(basePath, 'middlewares'));
  loadModulesFrom(path.join(basePath, 'controllers'));

  registerAtomics();
}
