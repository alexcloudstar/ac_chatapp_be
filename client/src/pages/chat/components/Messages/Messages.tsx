import { Fragment, useLayoutEffect, useState } from 'react'
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
    // if (messages) {
    //   setMessagesState(messages)
    // }

    socket.once('chat', (data: MessagesType) => {
      console.log('Data', data)
      setMessagesState([...messagesState, data])
    })
  }, [messagesState])

  console.log(messages)

  return (
    <div className="messages ">
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
    </div>
  )
}

export default Messages
