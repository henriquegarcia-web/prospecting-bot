import { useTranslation } from 'react-i18next'
import { Button } from '@primereact/ui/button'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <main className="app-shell flex align-items-center justify-content-center p-4">
      <section className="text-center" aria-labelledby="not-found-title">
        <h1 id="not-found-title">{t('notFound.title')}</h1>
        <p>{t('notFound.description')}</p>
        <Button onClick={() => navigate('/')}>{t('notFound.action')}</Button>
      </section>
    </main>
  )
}
