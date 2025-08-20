import React, { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import AppIcon from '@/app/components/base/app-icon'
import type { ConversationItem } from '@/types/app'
import DropdownMenu from '@/app/components/base/dropdown-menu'
import UserPanel from './user-panel'
import { APP_INFO } from '@/config'
import Loading from '../base/loading'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onRenameConversation: (id: string, name: string) => void
  onDeleteConversation: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onRenameConversation,
  onDeleteConversation,
  onLoadMore,
  hasMore,
}) => {
  const { t } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore)
          onLoadMore()
      },
      { threshold: 1.0 },
    )

    const sentinel = sentinelRef.current
    if (sentinel)
      observer.observe(sentinel)

    return () => {
      if (sentinel)
        observer.unobserve(sentinel)
    }
  }, [hasMore, onLoadMore])

  const handleRename = (id: string) => {
    const newName = prompt(t('app.chat.renameConversation') as string)
    if (newName)
      onRenameConversation(id, newName)
  }

  return (
    <div
      className="shrink-0 flex flex-col bg-white pc:w-[280px] tablet:w-[240px] mobile:w-[240px] h-full border-r border-gray-200"
    >
      <div className='flex flex-shrink-0 p-4 !pb-2'>
        <AppIcon size='large' />
        <div className='ml-2 text-lg font-bold text-gray-800'>{APP_INFO.title}</div>
      </div>
      <div className="flex flex-shrink-0 p-4 !pb-0">
        <Button
          onClick={() => { onCurrentIdChange('-1') }}
          className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
          <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
        </Button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0 overflow-y-auto">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              <div className="flex items-center flex-1" onClick={() => onCurrentIdChange(item.id)}>
                <ItemIcon
                  className={classNames(
                    isCurrent
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.id !== '-1' && (
                <DropdownMenu
                  actions={[
                    { name: t('app.chat.rename'), onClick: () => handleRename(item.id) },
                    { name: t('app.chat.delete'), onClick: () => onDeleteConversation(item.id) },
                  ]}
                />
              )}
            </div>
          )
        })}
        {hasMore && <div ref={sentinelRef}><Loading /></div>}
      </nav>
      <div className='p-4'>
        <UserPanel />
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
