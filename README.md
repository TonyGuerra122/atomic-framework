# 🚀 Atomic Framework

O **Atomic Framework** é um motor leve e opinativo para construir APIs RESTful usando TypeScript + Fastify. Ele utiliza decorators e injeção de dependência para uma arquitetura modular e escalável.

## ✨ Recursos

- ⚙️ Injeção de dependência baseada em decorators
- 🚀 Servidor Fastify pronto para produção
- 🧩 Estrutura modular para controllers, services, middlewares e repositórios
- 🔧 CLI para geração de projetos via `atomic init`

---

## 📦 Instalação

Instale o CLI globalmente:

```bash
npm install -g @tonyguerradev/atomic-framework
```
Ou use com `npx`:
```bash
npx atomic-framework init meu-projeto
```

---

## ⚙️ Comandos disponíveis
### `atomic init <nome-do-projeto>`
Cria uma nova aplicação com a estrutura base do Atomic Framework.
**Exemplo:**
```bash
atomic init minha-api
```
Argumentos opcionais:
-   `--no-install`: **não instala dependências automaticamente.**

---

## 🏗️ Estrutura gerada
```
meu-projeto/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── repositories/
│   ├── configurations/
│   └── main.ts
├── package.json
├── tsconfig.json
├── .prettierrc.json
├── .eslintrc.json
└── ...
```

---

## 🧪 Desenvolvimento
Execute o projeto com:
```bash
npm run dev
```

---

## 🛠 Exemplo de Controller
```typescript
import { Controller, Get, Request, Response } from 'atomic-framework';
import BaseController from './base.controller';

@Controller('/')
export class HelloController extends BaseController {
  @Get('/')
  public sayHello(req: Request, res: Response): void {
    this.ok(res, 'Hello World!');
  }
}
```

---

## 📄 Licença
MIT © Anthony Guerra