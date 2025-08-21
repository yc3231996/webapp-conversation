import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // When deleting a cookie, you must pass the same options (especially `secure` and `path`)
  // that were used to set the cookie.
  cookies().set({
    name: 'session',
    value: '',
    path: '/',
    maxAge: -1, // Expire the cookie immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  return NextResponse.json({ message: 'Logout successful' })
}
