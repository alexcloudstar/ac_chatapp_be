import { FC, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

import {
  useAddConversationMutation,
  useConversationsQuery,
} from '@/store/services/conversations'
import { useCurrentUserQuery } from '@/store/services/users'
import { Header, Search, Button, Modal } from '@/stories'
import { setLocalStorage } from '@/utils/localStorage'

import { ApiState } from '../ApiState'
import { AuthProps } from '../Auth/types'
import { CreateRoom } from '../CreateRoom'

import styles from './header.module.css'

const ChatHeader: FC<AuthProps> = ({ setIsLoggedIn }) => {
  const [showModal, setShowModal] = useState<boolean>(true)

  const { data: user, error, isLoading } = useCurrentUserQuery()
  const [addRoom, { error: addRoomError }] = useAddConversationMutation()

  const { refetch } = useConversationsQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  const createRoom = () => {
    setShowModal(!showModal)
    // try {
    //   await addRoom({
    //     userIds: ['2'],
    //     name: 'Room From Frontend 2',
    //     profanityWords: ['drugs', 'drug'],
    //     isPrivate: true,
    //   })
    //   refetch()
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const onCloseModal = () => setShowModal(!showModal)

  const logout = () => {
    setLocalStorage('accessToken', '')
    setIsLoggedIn(false)
  }

  if (error)
    return (
      <ApiState
        errorMessage={error?.data?.message || addRoomError?.data?.message}
      />
    )

  if (isLoading) return <ApiState />

  return (
    <>
      {showModal && (
        <Modal title="Create room" onClose={onCloseModal} isSmall>
          <CreateRoom />
        </Modal>
      )}
      <div className={styles.container}>
        <div className="show-mobile mb-12">
          <Header user={user} classes="justify-center" />
        </div>
        <div className="flex justify-between items-center cursor-pointer">
          <div className="hide-mobile">
            <Header user={user} />
          </div>

          <Search query="" icon={<FaSearch />} classes={styles.customInput} />
          <div className="flex items-center">
            <Button
              icon={<FaPlus />}
              classes={styles.btnCreateRoom}
              onClick={createRoom}
            />
            <FiLogOut className="text-[24px] ml-8" onClick={logout} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatHeader
