import { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import { MessagesType } from 'components/ChatList/types'
import { useGetRoomMessagesQuery } from 'store/services/messages'
import { useCurrentUserQuery } from 'store/services/users'
import { Avatar } from 'stories'
import { ReduxQueryType, User } from 'types'

import { Message } from '../Message'

const socket = io('http://localhost:4000')

const Messages = () => {
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
    socket.on('typing', (data) => {
      setIsTyping({
        isTyping: true,
        user: {
          id: data.sender.id,
          username: data.sender.name || data.sender.username,
        },
      })
    })
  })

  return (
    <div className="messages overflow-y-auto pr-[30px]">
      {messagesState?.map((message) => (
        <Fragment key={message.id}>
          <div
            className={`flex mt-6 mb-6 ${
              user.id === message.senderId ? 'justify-start' : 'justify-end'
            }`}
          >
            <Avatar user={message.sender} classes="mr-2" />
            <Message message={message} />
          </div>
        </Fragment>
      ))}
      {user?.id !== isTyping?.user.id && isTyping.isTyping && (
        <div>{isTyping.user.username} is typing...</div>
      )}
    </div>
  )
}

export default Messages
