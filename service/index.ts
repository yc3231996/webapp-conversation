import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'

export interface ISendRequest {
  onData?: IOnData
  onCompleted?: IOnCompleted
  onFile?: IOnFile
  onThought?: IOnThought
  onMessageEnd?: IOnMessageEnd
  onMessageReplace?: IOnMessageReplace
  onError?: IOnError
  getAbortController?: (abortController: AbortController) => void
  onWorkflowStarted?: IOnWorkflowStarted
  onWorkflowFinished?: IOnWorkflowFinished
  onNodeStarted?: IOnNodeStarted
  onNodeFinished?: IOnNodeFinished
}
import { get, post, ssePost } from './base'
import type { Feedbacktype } from '@/types/app'

const parseUserInfo = () => {
  const userInfo = globalThis.localStorage.getItem('userInfo')
  if (userInfo) {
    // 使用与后端API相同的user格式: user_${APP_ID}:${username}
    const parsedUserInfo = JSON.parse(userInfo)
    const { APP_ID } = require('@/config')
    const user = `user_${APP_ID}:${parsedUserInfo.username}`
    return { user }
  }

  return {}
}

export const sendChatMessage = async (body: Record<string, any>, { onData, onCompleted, onFile, onThought, onMessageEnd, onMessageReplace, onError, getAbortController, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished }: ISendRequest) => {
  const { inputs, query, conversation_id: conversationId, files } = body
  const bodyParams = {
    ...{
      conversation_id: conversationId,
      query,
      inputs,
      files,
      response_mode: 'streaming',
    },
    ...parseUserInfo(),
  }

  return ssePost('chat-messages', {
    body: bodyParams,
  }, { onData, onCompleted, onFile, onThought, onMessageEnd, onMessageReplace, onError, getAbortController, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished })
}

// 每页加载的对话数量常量
const CONVERSATIONS_PER_PAGE = 20

export const fetchConversations = async (lastId = '', limit = CONVERSATIONS_PER_PAGE) => {
  const userInfo = parseUserInfo()
  const params: any = { limit, ...userInfo }
  
  // 只有当lastId不为空且不是空字符串时，才添加last_id参数
  if (lastId && lastId !== '') {
    params.last_id = lastId
  }
  
  
  return get('conversations', { params })
}

export const fetchChatList = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
}

// init value. wait for server update
export const fetchAppParams = async () => {
  return get('parameters')
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}
