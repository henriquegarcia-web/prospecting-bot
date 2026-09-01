import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  LuEye,
  LuEyeOff,
  LuLockKeyhole,
  LuLogIn,
  LuMail,
  LuShieldCheck,
  LuSparkles,
} from 'react-icons/lu'
import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '@/contexts/auth-context'
import {
  loginSchema,
  type LoginFormValues,
} from '@/schemas/login.schema'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { isLoading, signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const destination = (location.state as LoginLocationState | null)?.from ?? '/'

  if (!isLoading && user) return <Navigate to={destination} replace />

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setSubmitError(null)

    try {
      await signIn(email, password)
      navigate(destination, { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    }
  })

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="Prospect Intelligence">
        <div className="login-brand">
          <span aria-hidden="true"><LuSparkles /></span>
          <div><strong>Prospect</strong><small>Intelligence</small></div>
        </div>
        <div className="login-showcase__content">
          <span className="login-kicker"><LuShieldCheck /> Ambiente protegido</span>
          <h1>Inteligência comercial com acesso seguro.</h1>
          <p>Consulte oportunidades, leads e indicadores da sua operação em um único painel.</p>
        </div>
        <span className="login-showcase__footer">Acesso restrito a usuários cadastrados</span>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <div className="login-card__heading">
            <span className="login-card__icon" aria-hidden="true"><LuLockKeyhole /></span>
            <span className="eyebrow">Acesso ao dashboard</span>
            <h2 id="login-title">Entre na sua conta</h2>
            <p>Use o e-mail e a senha cadastrados no Supabase.</p>
          </div>

          <form className="login-form" onSubmit={onSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <div className={`login-input ${errors.email ? 'login-input--invalid' : ''}`}>
                <LuMail aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="voce@empresa.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
              </div>
              {errors.email ? <span className="field-error" id="email-error">{errors.email.message}</span> : null}
            </div>

            <div className="login-field">
              <label htmlFor="password">Senha</label>
              <div className={`login-input ${errors.password ? 'login-input--invalid' : ''}`}>
                <LuLockKeyhole aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
              {errors.password ? <span className="field-error" id="password-error">{errors.password.message}</span> : null}
            </div>

            {submitError ? <div className="ui-message ui-message--error" role="alert">{submitError}</div> : null}

            <button className="ui-button login-submit" type="submit" disabled={isSubmitting || isLoading}>
              <LuLogIn aria-hidden="true" />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="login-card__note">O cadastro e a gestão de usuários são feitos pelo administrador no Supabase.</p>
        </div>
      </section>
    </main>
  )
}
