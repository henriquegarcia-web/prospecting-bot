import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'

import 'primeflex/primeflex.css'
import '@/lib/i18n'
import '@/styles/globals.css'

import { App } from '@/App'
import { AuthProvider } from '@/contexts/AuthProvider'
import { queryClient } from '@/lib/query-client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz da aplicação não encontrado.')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
