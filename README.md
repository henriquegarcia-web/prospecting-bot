# Prospecting Bot

Dashboard de leitura e curadoria da operação de prospecção. O frontend usa React, TypeScript, Vite, CSS/PrimeFlex, TanStack Query e Supabase. A interface usa apenas recursos sem exigência de chave de licença.

## Dashboard

O dashboard oferece, entre suas rotas:

- indicadores de volume, contato, qualificação e prioridade;
- leitura do pipeline e das ofertas recomendadas;
- ranking das oportunidades mais prioritárias;
- indicadores de completude da base;
- filtros por busca, tier e tipo de oportunidade;
- tabela paginada e responsiva, sem ações de criação, edição ou exclusão.

As áreas do dashboard usam rotas próprias do React Router:

- `/login`: autenticação por e-mail e senha com Supabase Auth;
- `/`: visão geral e indicadores principais;
- `/oportunidades`: pipeline, ofertas e priorização;
- `/leads`: filtros e tabela da base;
- `/qualidade`: completude dos dados e gaps digitais.

Os dados são lidos da tabela `public.leads`, conforme o contrato em `src/types/lead.ts`. O dashboard carrega até 1.000 leads, ordenados por `lead_priority_score`, e informa na interface quando o total visível no banco é maior que esse recorte.

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
```

Variáveis com prefixo `VITE_` são públicas e entram no bundle do navegador. Nunca use a chave `service_role`, senhas ou outros segredos no frontend.

O acesso do frontend deve usar somente a chave pública/publishable. A tabela `leads` precisa ter RLS habilitada e uma policy de `SELECT` compatível com os usuários autorizados a visualizar a operação. Rotas protegidas no React não substituem essa policy.

Os usuários são criados pelo administrador em **Supabase → Authentication → Users**. Não existe cadastro público na aplicação. A migration `supabase/migrations/20260831090000_require_auth_for_dashboard.sql` permite leitura das colunas do dashboard somente para sessões autenticadas e bloqueia o papel anônimo.

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
