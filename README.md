# Prospecting Bot

Base de uma aplicação SaaS com React, TypeScript e Vite. O frontend usa PrimeReact/PrimeFlex, React Router, TanStack Query, React Hook Form, Zod, i18n e Supabase.

## Requisitos

- Node.js 24+
- npm 11+

## Desenvolvimento

```bash
npm install
copy .env.example .env.local
npm run dev
```

Preencha em `.env.local` apenas as credenciais públicas do Supabase:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_PRIMEREACT_LICENSE=
```

Variáveis com prefixo `VITE_` são públicas e entram no bundle do navegador. Nunca use a chave `service_role`, senhas ou outros segredos no frontend.

`VITE_PRIMEREACT_LICENSE` é opcional no desenvolvimento inicial e recebe o token de licença do PrimeUI quando o projeto possuir uma licença para o Styled Mode do PrimeReact 11.

## Scripts

- `npm run dev`: servidor local do Vite.
- `npm run lint`: análise estática com Oxlint.
- `npm run typecheck`: validação TypeScript.
- `npm test`: testes com Vitest e React Testing Library.
- `npm run build`: typecheck e build de produção.

## Organização

O fluxo esperado para dados remotos é:

```text
Interface -> Hook -> TanStack Query -> Service -> Supabase -> PostgreSQL/RLS
```

Crie pastas como `components`, `hooks`, `schemas`, `services` e `types` conforme as primeiras funcionalidades exigirem. Mudanças de banco devem entrar em `supabase/migrations`, com RLS em todas as tabelas expostas ao frontend.
