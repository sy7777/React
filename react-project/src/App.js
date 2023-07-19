import { useEffect, useState } from 'react'
import { createContext } from 'react'
import './App.scss'

// 聊天室
const ChatRoom = ({ roomId}) => {
    // ...

    // console.log('ischatting:', isChatting)

    // 1. 挂载时，和默认聊天室建立连接,但是一直是music房间
    // useEffect(() => {
    //   console.log('建立连接： music 房间')
    // }, [])

    // 2. 更新时，和最新聊天室建立连接
    // 注意：该调用方式会在组件挂载以及更新时都会执行
    // useEffect(() => {
    //   console.log(`建立连接： ${roomId} 房间`)
    // }, [roomId])

    // 3. 卸载时，和聊天室断开连接
    // useEffect(() => {
    //   return () => {
    //     console.log('断开连接')
    //   }
    // }, [])

    useEffect(() => {
        console.log(`建立连接： ${roomId} 房间`);
        return () => {
            // clean 
            console.log(`断开连接: ${roomId} 房间`);
        }
    }, [roomId])
    return (
        <div className="chat-room">
            <h1>welcome to {roomId} room!</h1>
        </div>
    )
}
const App = () => {
    // id
    const [roomId, setRoomId] = useState('music')
    //   chatting
    const [isChatting, setIsChatting] = useState(true);
    return (
        <div className="app">
            <button onClick={() => { setIsChatting(!isChatting); console.log('ischatting:', isChatting) }}>
                {isChatting ? 'End the chat' : 'Start chatting'}
            </button>

            {isChatting ? (
                <div>
                    <label>
                        Select the room:
                        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
                            <option value="music">music</option>
                            <option value="travel">travel</option>
                            <option value="sports">sports</option>
                        </select>
                    </label>
                    {/*chat room */}
                    <ChatRoom roomId={roomId} />
                </div>
            ) : (
                <p>Click【start chatting】button, start chatting~</p>
            )}
        </div>

    )
}

export default App
