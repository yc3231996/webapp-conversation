import { useState } from 'react'
import produce from 'immer'
import { useGetState } from 'ahooks'
import type { ConversationItem } from '@/types/app'

type ConversationInfoType = Omit<ConversationItem, 'inputs' | 'id'>
function useConversation() {
  const [conversationList, setConversationList] = useState<ConversationItem[]>([])
  const [currConversationId, doSetCurrConversationId, getCurrConversationId] = useGetState<string>('-1')
  const [inputs, setInputs, getInputs] = useGetState<Record<string, any>>({})

  // when set conversation id, we do not have set appId
  const setCurrConversationId = (id: string, appId: string, isSetToLocalStroge = true) => {
    doSetCurrConversationId(id)
    if (id === '-1')
      setInputs({})

    if (isSetToLocalStroge && id !== '-1') {
      // conversationIdInfo: {[appId1]: conversationId1, [appId2]: conversationId2}
      const conversationIdInfo = globalThis.localStorage?.getItem('conversationIdInfo') ? JSON.parse(globalThis.localStorage?.getItem('conversationIdInfo') || '') : {}
      conversationIdInfo[appId] = id
      globalThis.localStorage?.setItem('conversationIdInfo', JSON.stringify(conversationIdInfo))
    }
  }

  const getConversationIdFromStorage = (appId: string) => {
    const conversationIdInfo = globalThis.localStorage?.getItem('conversationIdInfo') ? JSON.parse(globalThis.localStorage?.getItem('conversationIdInfo') || '') : {}
    const id = conversationIdInfo[appId]
    return id
  }

  const isNewConversation = currConversationId === '-1'

  // info is muted
  const [newConversationInfo, setNewConversationInfo] = useState<ConversationInfoType | null>(null)
  const [existConversationInfo, setExistConversationInfo] = useState<ConversationInfoType | null>(null)
  const currConversationInfo = isNewConversation ? newConversationInfo : existConversationInfo

  return {
    conversationList,
    setConversationList,
    currConversationId,
    getCurrConversationId,
    setCurrConversationId,
    getConversationIdFromStorage,
    isNewConversation,
    inputs,
    setInputs,
    getInputs,
    currConversationInfo,
    setNewConversationInfo,
    setExistConversationInfo,
  }
}

export default useConversation
