#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
declare const __dirname: string;

// Prompt de entrada
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

// Copiar arquivos do template
function copyTemplate(templateDir: string, targetDir: string) {
  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Template não encontrado em: ${templateDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const entries = fs.readdirSync(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;

    const src = path.join(templateDir, entry.name);
    const dest = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplate(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// Atualiza o nome no package.json
function updatePackageJson(targetPath: string, projectName: string) {
  const pkgPath = path.join(targetPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// --- CLI Handler
const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];
const noInstall = args.includes('--no-install');

async function initProject() {
  const name = projectName || (await prompt('📦 Nome do projeto: '));
  if (!name) {
    console.error('❌ Nome do projeto é obrigatório');
    process.exit(1);
  }

  const targetPath = path.resolve(process.cwd(), name);
  const templatePath = path.resolve(__dirname, '../template');

  if (fs.existsSync(targetPath)) {
    const overwrite = await prompt(
      '⚠️  Pasta já existe. Sobrescrever? (y/N): ',
    );
    if (overwrite.toLowerCase() !== 'y') {
      console.log('🚫 Cancelado.');
      process.exit(0);
    }
  }

  console.log('📂 Gerando estrutura...');
  copyTemplate(templatePath, targetPath);

  updatePackageJson(targetPath, name);

  if (!noInstall) {
    console.log('📦 Instalando dependências...');
    execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
  } else {
    console.log('⚠️  Instalação pulada (--no-install)');
  }

  console.log('✅ Projeto criado em:', targetPath);
}

// --- Entry Point
switch (command) {
  case 'init':
    initProject().catch((err) => {
      console.error('❌ Erro ao criar o projeto:', err);
      process.exit(1);
    });
    break;
  case '--help':
  case '-h':
  default:
    console.log(`
🔧 Atomic Framework CLI

Comandos disponíveis:
  init <nome>         Cria um novo projeto com base no template
  --no-install         Pula a instalação de dependências
  -h, --help           Exibe esta ajuda

Exemplo:
  atomic init meu-projeto
    `);
    break;
}
