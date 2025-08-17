import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  console.log('🚀 ~ locale:', locale)

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
