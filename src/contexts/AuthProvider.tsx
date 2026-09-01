import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'

import {
  AuthContext,
  type AuthContextValue,
} from '@/contexts/auth-context'
import { queryClient } from '@/lib/query-client'
import { getSupabaseClient } from '@/lib/supabase'

function getFriendlyAuthError(message: string) {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos.'
  }

  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Confirme o e-mail do usuário no Supabase antes de entrar.'
  }

  return 'Não foi possível entrar. Verifique os dados e tente novamente.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    let isMounted = true

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return

      if (error) {
        queryClient.clear()
        setSession(null)
      } else {
        setSession(data.session)
      }
      setIsLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (event === 'SIGNED_OUT') queryClient.clear()
        setSession(nextSession)
        setIsLoading(false)
      },
    )

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      signIn: async (email, password) => {
        const { data, error } = await getSupabaseClient().auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          },
        )

        if (error) throw new Error(getFriendlyAuthError(error.message))
        setSession(data.session)
      },
      signOut: async () => {
        const { error } = await getSupabaseClient().auth.signOut()
        if (error) throw new Error('Não foi possível encerrar a sessão.')
      },
    }),
    [isLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
