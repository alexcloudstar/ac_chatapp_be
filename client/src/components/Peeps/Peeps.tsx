import { useState } from 'react'
import { SwiperSlide } from 'swiper/react'

import { useGetUsersQuery } from 'store/services/users'
import { Peep } from 'stories'
import { ReduxQueryType, User } from 'types'

import { PeepsSlider } from './components'

const Peeps = () => {
  const { data: users } = useGetUsersQuery<ReduxQueryType<User[]>>()
  const [isOnline, setIsOnline] = useState(false)

  return (
    <>
      <h2 className="mt-[25px] mb-[15px]">Peeps</h2>
      <div className="w-full">
        <PeepsSlider>
          {users?.map((user: User) => (
            <SwiperSlide key={user.id}>
              <>
                <Peep
                  owner={user.username || 'Unknown'}
                  isFavorite={false}
                  bgImage={user.avatar}
                  onClick={() => console.log('Room 1 clicked')}
                />
                <div
                  className={`online-status ${
                    isOnline ? 'bg-[#7cd452]' : 'bg-white'
                  } w-3.5 h-3.5 absolute bottom-0 left-2 rounded-[50px]`}
                ></div>
              </>
            </SwiperSlide>
          ))}
        </PeepsSlider>
      </div>
    </>
  )
}

/*
    width: 15px;
    height: 15px;
    background: #7cd452;
    border-radius: 50px;
    position: absolute;
    bottom: 0;
    left: 5px;
 */

export default Peeps
