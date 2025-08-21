import { getLocaleOnServer } from '@/i18n/server'
import I18nProvider from '@/i18n/i18n-provider'
import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <I18nProvider>
          <div className="overflow-x-auto">
            <div className="w-screen h-screen min-w-[300px]">
              {children}
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
