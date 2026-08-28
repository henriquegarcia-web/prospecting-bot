import { fireEvent, render, screen } from '@testing-library/react'
import { PrimeReactProvider } from '@primereact/core'

import '@/lib/i18n'

import { HomePage } from '@/pages/HomePage'

describe('HomePage', () => {
  it('apresenta a base do projeto e orienta a configuração do Supabase', () => {
    render(
      <PrimeReactProvider>
        <HomePage />
      </PrimeReactProvider>,
    )

    expect(
      screen.getByRole('heading', { name: 'Prospecting Bot' }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Verificar configuração' }),
    )

    expect(
      screen.getByText(/Copie .env.example para .env.local/),
    ).toBeInTheDocument()
  })
})
