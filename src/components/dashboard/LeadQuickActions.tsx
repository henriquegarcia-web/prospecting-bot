import {
  LuGlobe,
  LuMapPin,
  LuMessageCircle,
  LuPhone,
} from 'react-icons/lu'

export interface LeadQuickActionsLead {
  business_name: string
  phone?: string | null
  phone_e164?: string | null
  website_url?: string | null
  google_maps_url?: string | null
}

interface LeadQuickActionsProps {
  lead: LeadQuickActionsLead
}

function sanitizePhone(value: string | null) {
  return value?.replace(/\D/g, '') ?? ''
}

function getTelephoneNumber(value: string | null) {
  const sanitized = sanitizePhone(value)

  if (!sanitized) return null

  return value?.trim().startsWith('+') ? `+${sanitized}` : sanitized
}

function getExternalUrl(value: string | null) {
  const trimmed = value?.trim()

  if (!trimmed) return null

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
  const url = trimmed.startsWith('//')
    ? `https:${trimmed}`
    : hasScheme
      ? trimmed
      : `https://${trimmed}`

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function LeadQuickActions({ lead }: LeadQuickActionsProps) {
  const whatsappNumber = sanitizePhone(lead.phone_e164 ?? null) || sanitizePhone(lead.phone ?? null)
  const telephoneNumber = getTelephoneNumber(lead.phone_e164 ?? null) ?? getTelephoneNumber(lead.phone ?? null)
  const websiteUrl = getExternalUrl(lead.website_url ?? null)
  const googleMapsUrl = getExternalUrl(lead.google_maps_url ?? null)

  if (!whatsappNumber && !telephoneNumber && !websiteUrl && !googleMapsUrl) {
    return null
  }

  return (
    <nav aria-label={`Atalhos rápidos para ${lead.business_name}`} className="quick-actions">
      {whatsappNumber ? (
        <a
          aria-label={`Enviar mensagem no WhatsApp para ${lead.business_name}`}
          className="quick-actions__link quick-actions__link--whatsapp"
          href={`https://wa.me/${whatsappNumber}`}
          rel="noopener noreferrer"
          target="_blank"
          title="WhatsApp"
        >
          <LuMessageCircle aria-hidden="true" />
        </a>
      ) : null}
      {telephoneNumber ? (
        <a
          aria-label={`Ligar para ${lead.business_name}`}
          className="quick-actions__link quick-actions__link--phone"
          href={`tel:${telephoneNumber}`}
          title="Ligar"
        >
          <LuPhone aria-hidden="true" />
        </a>
      ) : null}
      {websiteUrl ? (
        <a
          aria-label={`Abrir website de ${lead.business_name}`}
          className="quick-actions__link quick-actions__link--website"
          href={websiteUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="Abrir website"
        >
          <LuGlobe aria-hidden="true" />
        </a>
      ) : null}
      {googleMapsUrl ? (
        <a
          aria-label={`Abrir ${lead.business_name} no Google Maps`}
          className="quick-actions__link quick-actions__link--maps"
          href={googleMapsUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="Abrir no Google Maps"
        >
          <LuMapPin aria-hidden="true" />
        </a>
      ) : null}
    </nav>
  )
}
