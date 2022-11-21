import { Fragment } from 'react'

import { MessagesType } from 'components/ChatList/types'

const Message = ({ message }: { message: MessagesType }) => {
  return (
    <Fragment>
      <div className="message">
        <div className="header">
          <strong>{message.sender.username} </strong>
          <span>{message.createdAt}</span>
        </div>
        <p className="message">{message.message}</p>
      </div>
    </Fragment>
  )
}

export default Message
