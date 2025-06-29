import fs from 'fs';
import path from 'path';

export function loadModulesFrom(dir: string): void {
  if (!fs.existsSync(dir)) {
    console.warn(`[atomic] Pasta não encontrada: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModulesFrom(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      try {
        require(fullPath);
      } catch (error) {
        console.error(`❌ Falha ao carregar o módulo ${fullPath}:`, error);
      }
    }
  }
}
