import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { jwtVerify } from 'jose'
import { API_KEY, API_URL, APP_ID } from '@/config'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export const getInfo = async (request: NextRequest) => {
  const session = request.cookies.get('session')?.value

  if (!session)
    throw new Error('Unauthorized')

  try {
    const { payload } = await jwtVerify(session, secret)
    const user = `user_${APP_ID}:${payload.username}`
    return {
      user,
    }
  }
  catch (err) {
    throw new Error('Unauthorized')
  }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
