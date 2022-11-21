import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { MessagesType } from 'components/ChatList/types'
import { useGetRoomMessagesQuery } from 'store/services/messages'
import { useCurrentUserQuery } from 'store/services/users'
import { Avatar } from 'stories'
import { ReduxQueryType, User } from 'types'

import { Message } from '../Message'

const Messages = () => {
  const { roomId } = useParams()
  const { data: messages } = useGetRoomMessagesQuery<
    ReduxQueryType<MessagesType[]>
  >({ roomId: roomId ? +roomId : -1 })

  const { data: user } = useCurrentUserQuery<ReduxQueryType<User>>()

  return (
    <div className="messages ">
      {messages?.map((message) => (
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
