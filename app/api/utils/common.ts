import { type NextRequest, NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { jwtVerify } from 'jose'
import { API_KEY, API_URL, APP_ID } from '@/config'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export const getInfo = async (request: NextRequest) => {
  const session = request.cookies.get('session')?.value

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { payload } = await jwtVerify(session, secret)
    const user = `user_${APP_ID}:${payload.username}`
    return {
      user,
    }
  }
  catch (err) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
