import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {SignJWT} from 'jose';

const users = [
  { id: '1', username: 'admin', password: 'admin' },
];

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    const jwt = await new SignJWT({ id: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    cookies().set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    return NextResponse.json({ message: 'Login successful' })
  } else {
    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
  }
}
