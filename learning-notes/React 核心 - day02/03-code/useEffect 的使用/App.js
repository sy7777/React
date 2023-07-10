import { useEffect } from 'react'
import { useState } from 'react'
import './App.scss'

// useEffect 的使用
/*
 * 需求：在线聊天室的连接和关闭
 * 步骤：
 * 1. 挂载时，和默认聊天室建立连接
 * 2. 更新时，和最新聊天室建立连接
 * 3. 卸载时，和聊天室断开连接
 */

// 聊天室
const ChatRoom = ({ roomId }) => {
  // ...
  console.log('当前房间：', roomId)

  // 1. 挂载时，和默认聊天室建立连接
  // useEffect(() => {
  //   console.log('建立连接： music 房间')
  // }, [])

  // 2. 更新时，和最新聊天室建立连接
  // 注意：该调用方式会在组件挂载以及更新时都会执行
  // useEffect(() => {
  //   console.log(`建立连接： ${roomId} 房间`)
  // }, [roomId])

  // 3. 卸载时，和聊天室断开连接
  useEffect(() => {
    return () => {
      console.log('断开连接')
    }
  }, [])

  return (
    <div className="chat-room">
      <h1>欢迎来到 {roomId} 房间！</h1>
    </div>
  )
}

const App = () => {
  // 房间id
  const [roomId, setRoomId] = useState('music')
  // 是否正在聊天
  const [chatting, setChatting] = useState(true)

  return (
    <div className="app">
      <button onClick={() => setChatting(!chatting)}>
        {chatting ? '退出聊天' : '开始聊天'}
      </button>

      {chatting ? (
        <div>
          <label>
            选择聊天室：
            <select value={roomId} onChange={e => setRoomId(e.target.value)}>
              <option value="music">music</option>
              <option value="travel">travel</option>
              <option value="sports">sports</option>
            </select>
          </label>
          {/* 聊天室 */}
          <ChatRoom roomId={roomId} />
        </div>
      ) : (
        <p>点击【开始聊天】按钮，开始吧~</p>
      )}
    </div>
  )
}

export default App
