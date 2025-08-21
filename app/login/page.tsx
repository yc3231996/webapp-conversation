'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const LoginPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        router.push('/')
      }
      else {
        const data = await response.json()
        setError(data.message || t('login.errorMessage'))
      }
    }
    catch (error) {
      setError(t('login.errorOccurred'))
    }
  }

  const isFormValid = username.trim() !== '' && password.trim() !== ''

  if (!isClient) {
    // Render nothing or a loading spinner on the server to avoid hydration mismatch
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col justify-center items-center w-1/2 bg-white p-10 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-800">{t('login.title')}</h1>
        <p className="text-lg text-gray-600 max-w-md">
          {t('login.description')}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('login.login')}</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {t('login.username')}
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                type="text"
                placeholder={t('login.username') as string}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                {t('login.password')}
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                className={cn(
                  'text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-300',
                  {
                    'bg-blue-500 hover:bg-blue-600': isFormValid,
                    'bg-gray-300 cursor-not-allowed': !isFormValid,
                  },
                )}
                type="submit"
                disabled={!isFormValid}
              >
                {t('login.signIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
