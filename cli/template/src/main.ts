import { App } from '@tonyguerradev/atomic-framework';
import bootstrap from './bootstrap';

const app = new App();

async function main() {
  bootstrap();
  await app.init();
  await app.listen(3000);
}

main();
