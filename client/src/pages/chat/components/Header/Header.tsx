import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { ConversationType } from 'components/ChatList/types'
import { useGetConversationQuery } from 'store/services/conversations'
import { useCurrentUserQuery } from 'store/services/users'
import { Icon } from 'stories/components'
import { ReduxQueryType, User } from 'types'

const Header = () => {
  const { roomId } = useParams()
  const { data: conversation } = useGetConversationQuery<
    ReduxQueryType<ConversationType>
  >({ roomId: roomId ? +roomId : -1 })

  const { data: user } = useCurrentUserQuery<ReduxQueryType<User>>()

  const onDeleteRoom = () => {
    console.log('delete room')
  }

  const onChangeName = () => {
    console.log('change name')
  }

  return (
    <div className="conversation-header flex items-center justify-center">
      <h1 className="mr-2">{conversation?.name}</h1>
      {conversation?.userOwnerId === user?.id && (
        <div className="actions flex">
          <Icon
            icon={<FaTrashAlt />}
            onClick={onDeleteRoom}
            classes="mx-4 text-[22px]"
          />
          <Icon
            icon={<FaEdit />}
            onClick={onChangeName}
            classes="text-[22px]"
          />
        </div>
      )}
    </div>
  )
}

export default Header
