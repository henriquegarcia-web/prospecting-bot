import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  'pt-BR': {
    translation: {
      home: {
        eyebrow: 'Base do projeto pronta',
        title: 'Prospecting Bot',
        description:
          'React, TypeScript, Vite, TanStack Query e Supabase configurados para evoluir por funcionalidades.',
        action: 'Verificar configuração',
        configured: 'As variáveis públicas do Supabase estão configuradas.',
        notConfigured:
          'Copie .env.example para .env.local e preencha as variáveis públicas do Supabase.',
      },
      notFound: {
        title: 'Página não encontrada',
        description: 'O endereço informado não existe.',
        action: 'Voltar ao início',
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
