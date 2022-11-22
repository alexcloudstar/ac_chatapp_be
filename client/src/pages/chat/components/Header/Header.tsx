import { FaTrashAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { ConversationType } from 'components/ChatList/types'
import { useGetConversationQuery } from 'store/services/conversations'
import { ReduxQueryType } from 'types'

const Header = () => {
  const { roomId } = useParams()
  const { data: conversation } = useGetConversationQuery<
    ReduxQueryType<ConversationType>
  >({ roomId: roomId ? +roomId : -1 })

  return (
    <div className="conversation-header flex items-center justify-center">
      <h1 className="mr-2">{conversation?.name}</h1>
      <div className="actions">
        <button>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header
