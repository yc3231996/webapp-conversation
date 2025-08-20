import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// Read users from environment variable
const configuredUsers = process.env.DEFAULT_USERS?.split(',') || []
const users = configuredUsers.map((user, index) => {
  const [username, password] = user.split(':')
  return { id: `${index + 1}`, username, password }
})

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Add a default user if none are configured for easy setup
  if (users.length === 0)
    users.push({ id: '1', username: 'admin', password: 'admin' })

  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
    const jwt = await new SignJWT({ id: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret)

    cookies().set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    return NextResponse.json({ message: 'Login successful' })
  }
  else {
    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
  }
}
