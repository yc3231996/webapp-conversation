import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getInfo(request)
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object)
  }
  catch (error) {
    return NextResponse.json([])
  }
}
