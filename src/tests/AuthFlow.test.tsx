import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/auth-context'
import { LoginPage } from '@/pages/LoginPage'

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}))

function authState(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  return {
    isLoading: false,
    session: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
    ...overrides,
  } as ReturnType<typeof useAuth>
}

describe('fluxo de autenticação', () => {
  it('redireciona visitantes sem sessão para o login', async () => {
    vi.mocked(useAuth).mockReturnValue(authState())
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <p>Conteúdo protegido</p>
            </ProtectedRoute>
          ),
        },
        { path: '/login', element: <p>Tela de login</p> },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
      expect(screen.getByText('Tela de login')).toBeInTheDocument()
    })
  })

  it('valida os campos e entra usando somente e-mail e senha', async () => {
    const signIn = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useAuth).mockReturnValue(authState({ signIn }))
    const router = createMemoryRouter(
      [
        { path: '/login', element: <LoginPage /> },
        { path: '/leads', element: <p>Área autenticada</p> },
      ],
      {
        initialEntries: [
          { pathname: '/login', state: { from: '/leads' } },
        ],
      },
    )

    render(<RouterProvider router={router} />)

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Informe seu e-mail.')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument()
    expect(signIn).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'admin@empresa.com' },
    })
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senha-segura' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('admin@empresa.com', 'senha-segura')
      expect(router.state.location.pathname).toBe('/leads')
      expect(screen.getByText('Área autenticada')).toBeInTheDocument()
    })
  })
})
