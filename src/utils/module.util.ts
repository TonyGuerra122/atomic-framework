import fs from 'fs';
import path from 'path';

export function loadModulesFrom(dir: string): void {
  if (!fs.existsSync(dir)) {
    console.warn(`[atomic] Pasta não encontrada: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  const isDev = process.env.NODE_ENV === 'development';

  for (const file of files) {
    let fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModulesFrom(fullPath);
    } else {
      const ext = path.extname(file);

      // Em dev, carrega .ts | Em produção, carrega .js
      const shouldLoad = (isDev && ext === '.ts') || (!isDev && ext === '.js');

      if (!shouldLoad) continue;

      // Se estiver em produção e o caminho for .ts, troca para .js
      if (!isDev && fullPath.endsWith('.ts')) {
        fullPath = fullPath.replace(/\.ts$/, '.js');
      }

      try {
        require(fullPath);
        console.log(`[atomic] Módulo carregado: ${fullPath}`);
      } catch (error) {
        console.error(`❌ Falha ao carregar o módulo ${fullPath}:`, error);
      }
    }
  }
}
