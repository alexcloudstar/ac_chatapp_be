import React, { useState } from 'react'
import { BiSend } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import { useSendMessageMutation } from 'store/services/messages'
import { useCurrentUserQuery } from 'store/services/users'
import { ReduxQueryType, SendMessageType, User } from 'types'

const socket = io('http://localhost:4000')

const Footer = () => {
  const [textMessage, setTextMessage] = useState<string>('')
  const { roomId } = useParams()

  const [sendMessage] =
    useSendMessageMutation<ReduxQueryType<SendMessageType>>()
  const { data: user } = useCurrentUserQuery<ReduxQueryType<User>>()

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setTextMessage(e.target.value)

  const onSendMessage = () => {
    console.log('Message sent: ', textMessage)
    // await sendMessage({ roomId: roomId ? +roomId : -1, message: textMessage })

    socket.emit('chat', {
      textMessage,
      username: user?.name ?? user?.username,
    })

    socket.emit('typing')
  }

  return (
    <div className="footer w-full flex items-center">
      <textarea
        placeholder="Enter your message"
        className="mr-10 h-50 w-full h-20 p-2 rounded-lg resize-none outline-none text-blue-500"
        value={textMessage}
        onChange={onChange}
      />
      <button
        className="mt-5 mb-5 bg-blue-500 ease-in-out duration-300 hover:bg-blue-700 p-2 text-white rounded-xl w-24 flex items-center justify-around cursor-pointer h-20"
        onClick={onSendMessage}
      >
        <span>Send</span>
        <BiSend />
      </button>
    </div>
  )
}

export default Footer
