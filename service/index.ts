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
  if (userInfo)
    return { user: JSON.parse(userInfo).id }

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

export const fetchConversations = async (firstId = '') => {
  return get('conversations', { params: { limit: 20, first_id: firstId } })
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
