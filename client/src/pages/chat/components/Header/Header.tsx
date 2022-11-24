import { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import { ConversationType } from 'components/ChatList/types'
import {
  useDeleteConversationMutation,
  useGetConversationQuery,
} from 'store/services/conversations'
import { useCurrentUserQuery } from 'store/services/users'
import { Icon, Modal } from 'stories/components'
import { ReduxQueryType, User } from 'types'

const Header = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: conversation } = useGetConversationQuery<
    ReduxQueryType<ConversationType>
  >({ roomId: roomId ? +roomId : -1 })

  const { data: user } = useCurrentUserQuery<ReduxQueryType<User>>()

  const [deleteRoom] = useDeleteConversationMutation<
    ReduxQueryType<ConversationType['id']>
  >()

  const onDeleteRoom = async () => {
    await deleteRoom(roomId ?? '')
    setIsModalOpen(false)
    navigate('/')
  }

  const onChangeName = () => {
    console.log('change name')
  }

  const onToggleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Delete Chatroom"
          onClose={onToggleModal}
          isSmall
          hasFooter
          footerContent={
            <>
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded-md mr-4"
                onClick={onToggleModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-md"
                onClick={onDeleteRoom}
              >
                Delete
              </button>
            </>
          }
        >
          <p className="text-center">
            Are you sure you want to delete this chatroom?
          </p>
        </Modal>
      )}
      <div className="conversation-header flex items-center justify-center">
        <h1 className="mr-2">{conversation?.name}</h1>
        {conversation?.userOwnerId === user?.id && (
          <div className="actions flex">
            <Icon
              icon={<FaTrashAlt />}
              onClick={onToggleModal}
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
    </>
  )
}

export default Header
