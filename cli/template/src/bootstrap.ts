import path from 'path';
import {
  loadModulesFrom,
  registerAtomics,
} from '@tonyguerradev/atomic-framework';

const dirs = [
  'configurations',
  'repositories',
  'services',
  'middlewares',
  'controllers',
];

export default function bootstrap(): void {
  const rootDir = path.resolve(__dirname);

  dirs.forEach((dir) => {
    loadModulesFrom(path.join(rootDir, dir));
  });

  registerAtomics();
}
