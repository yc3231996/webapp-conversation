import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getInfo(request)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const lastId = searchParams.get('last_id')
    
    // 构建查询参数
    const params: any = { limit }
    if (lastId && lastId !== 'undefined') {
      params.last_id = lastId
    }
    
    // IMPORTANT: dify-client has a bug where it uses 'first_id' parameter name
    // but the actual Dify API expects 'last_id' according to dify-api.md documentation
    // So we bypass the client's getConversations method and call the API directly
    const apiParams: any = { user, limit }
    if (params.last_id) {
      apiParams.last_id = params.last_id
    }
    
    const axiosResponse: any = await client.sendRequest(
      'GET',
      '/conversations',
      null,
      apiParams
    )
    
    const response = axiosResponse.data
    
    return NextResponse.json(response)
  }
  catch (error: any) {
    console.error('❌ API /conversations error:', error.message)
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
