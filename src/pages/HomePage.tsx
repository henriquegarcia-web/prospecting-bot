import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@primereact/ui/button'
import { Card } from '@primereact/ui/card'
import { Message } from '@primereact/ui/message'

import { isSupabaseConfigured } from '@/lib/supabase'

export function HomePage() {
  const { t } = useTranslation()
  const [showConfiguration, setShowConfiguration] = useState(false)

  return (
    <main className="app-shell flex align-items-center justify-content-center p-4">
      <Card.Root className="w-full app-card">
        <Card.Body>
          <Card.Content>
            <div className="flex flex-column gap-4">
              <div>
                <span className="app-eyebrow">{t('home.eyebrow')}</span>
                <h1 className="mt-2 mb-2">{t('home.title')}</h1>
                <p className="m-0 app-description">{t('home.description')}</p>
              </div>

              <div>
                <Button onClick={() => setShowConfiguration(true)}>
                  {t('home.action')}
                </Button>
              </div>

              {showConfiguration ? (
                <Message.Root
                  severity={isSupabaseConfigured ? 'success' : 'info'}
                >
                  <Message.Content>
                    <Message.Text>
                      {isSupabaseConfigured
                        ? t('home.configured')
                        : t('home.notConfigured')}
                    </Message.Text>
                  </Message.Content>
                </Message.Root>
              ) : null}
            </div>
          </Card.Content>
        </Card.Body>
      </Card.Root>
    </main>
  )
}
