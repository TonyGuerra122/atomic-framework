import path from 'path';

import { loadModulesFrom } from 'atomic-framework';
import { registerAtomics } from 'atomic-framework';

const dirs = [
  'configurations',
  'repositories',
  'services',
  'middlewares',
  'controllers',
];

export default function bootstrap(): void {
  dirs.forEach((dir) => {
    loadModulesFrom(path.join(__dirname, '..', dir));
  });
  registerAtomics();
}
