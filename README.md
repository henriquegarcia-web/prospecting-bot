# Prospect Intelligence

Aplicação para operação manual de prospecção, construída com React, TypeScript, Vite, TanStack Query e Supabase.

## Áreas da aplicação

- **Visão geral:** métricas da base, visão da fila e os próximos leads para abordar.
- **Oportunidades:** lista priorizada e filtrável; separa leads novos dos que já foram movimentados no pipeline.
- **Base de leads:** consulta completa da base, atalhos de WhatsApp/ligação/site/Maps e dossiê detalhado em modal.

O status operacional usa o contrato do banco: `new`, `qualified`, `disqualified` e `archived`. A classificação (`qualification_status`) é exibida como inteligência de apoio e não é alterada pela interface.

## Segurança e acesso

O novo schema revoga o acesso público direto a `leads`. A migration [20260908103000_secure_lead_operations.sql](supabase/migrations/20260908103000_secure_lead_operations.sql) deve ser aplicada **depois** do script de recriação anexado ao projeto.

Ela:

- mantém RLS;
- concede ao usuário autenticado somente as colunas usadas pela interface e as views de operação;
- mantém update direto bloqueado;
- oferece a RPC `update_lead_pipeline_status`, que valida sessão e aceita somente os quatro estados do pipeline;
- registra `qualified_at` na primeira vez que o lead entra em `qualified`.

Como não há modelo de papéis no schema fornecido, todo usuário autenticado é um operador. O cadastro público está desabilitado na configuração local; replique essa configuração no projeto hospedado e crie usuários apenas pelo Supabase Auth.

> Não reaplique o SQL anexado em um banco com dados: ele executa `DROP TABLE public.leads CASCADE`.

## Desenvolvimento

```bash
npm install
copy .env.example .env.local
npm run dev
```

Configure apenas credenciais públicas:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Nunca coloque `service_role`, tokens ou outros segredos em variáveis `VITE_*`.

## Verificação

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
