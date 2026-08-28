import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import Aura from '@primeuix/themes/aura'
import { PrimeReactProvider } from '@primereact/core'

import 'primeflex/primeflex.css'
import '@/lib/i18n'
import '@/styles/globals.css'

import { App } from '@/App'
import { queryClient } from '@/lib/query-client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz da aplicação não encontrado.')
}

createRoot(rootElement).render(
  <StrictMode>
    <PrimeReactProvider
      theme={{ preset: Aura }}
      license={import.meta.env.VITE_PRIMEREACT_LICENSE}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
