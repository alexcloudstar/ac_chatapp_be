import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FiCornerRightDown } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import { MessagesType } from 'components/ChatList/types'
import { useGetRoomMessagesQuery } from 'store/services/messages'
import { useCurrentUserQuery } from 'store/services/users'
import { Avatar } from 'stories'
import { Icon } from 'stories/components'
import { ReduxQueryType, User } from 'types'

import { Message } from '../Message'

const socket = io('http://localhost:4000')

const Messages = () => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messagesState, setMessagesState] = useState<MessagesType[]>([])
  const [isTyping, setIsTyping] = useState<{
    isTyping: boolean
    user: {
      id: number
      username: string
    }
  }>({
    isTyping: false,
    user: {
      id: -1,
      username: '',
    },
  })

  const { roomId } = useParams()
  const { data: messages } = useGetRoomMessagesQuery<
    ReduxQueryType<MessagesType[]>
  >(
    { roomId: roomId ? +roomId : -1 },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const { data: user } = useCurrentUserQuery<ReduxQueryType<User>>()

  const onDeleteMessage = () => {}

  useLayoutEffect(() => {
    if (messages) {
      setMessagesState(messages)
    }
  }, [messages])

  useLayoutEffect(() => {
    socket.once('chat', (data: MessagesType) => {
      setMessagesState([...messagesState, data])
    })

    return () => {
      socket.off('chat')
    }
  }, [messagesState])

  useLayoutEffect(() => {
    socket.on(
      'typing',
      (data: { sender: Pick<User, 'id' | 'username' | 'name'> }) => {
        setIsTyping({
          isTyping: true,
          user: {
            id: data.sender.id,
            username: data.sender.name || data.sender.username,
          },
        })
      }
    )
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesState])

  return (
    <div className="messages overflow-y-auto pr-[30px]">
      {messagesState?.map((message) => (
        <Fragment key={message.id}>
          <div
            className={`flex mt-6 mb-6 ${
              user.id === message.senderId ? 'justify-start' : 'justify-end'
            }`}
          >
            {/* Todo: Add this just on hover */}
            {user.id === message.senderId && (
              <Icon
                icon={<FaTrashAlt className="text-[20px] mr-8" />}
                onClick={onDeleteMessage}
              />
            )}
            <Avatar user={message.sender} classes="mr-2" />
            <Message message={message} />
          </div>
        </Fragment>
      ))}
      {user?.id !== isTyping?.user.id && isTyping.isTyping && (
        <div>{isTyping.user.username} is typing...</div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default Messages
