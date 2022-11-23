import { Footer, Messages } from './components'

const Chat = () => {
  return (
    <div className="Chat h-[inherit] flex flex-col justify-between mt-20 ">
      <Messages />
      <Footer />
    </div>
  )
}

export default Chat
