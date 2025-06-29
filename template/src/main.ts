// src/main.ts
import { App } from 'atomic-framework';

const app = new App();

async function main() {
  await app.init();
  await app.listen(3000);
}

main();
