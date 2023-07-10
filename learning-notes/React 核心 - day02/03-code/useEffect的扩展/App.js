import { useEffect } from 'react'
import { useState } from 'react'
import './App.scss'

// useEffect 的扩展
/*
 * 需求：在线聊天室的连接和关闭
 */

// 聊天室
const ChatRoom = ({ roomId }) => {
  /*
   * 方式一：以【生命周期钩子函数】为主
   *        分别在每个钩子函数中，实现一个完整功能的部分效果
   */

  /*
   * 方案二：以【功能】为主
   *        一个功能的所有效果放在一起实现
   */

  const [count, setCount] = useState(0)
  let age = 10
  // 扩展1
  // 推荐：一个 useEffect 负责一个完整的功能
  // 代码执行过程： 1挂载 ①  2更新 ②①重复  3卸载 ②

  // 扩展2
  // 依赖项的说明
  // 指定依赖项的原则：Effect函数中用到的，并且是可变的值（props/state/组件中创建的变量等）
  // 一定要正确指定 useEffect 的依赖项，否则，会Bug
  useEffect(() => {
    console.log(`1 建立连接： ${roomId} 房间`, count, age)
    return () => {
      // 清理函数
      console.log(`2 断开连接： ${roomId} 房间`)
    }
  }, [roomId, count, age])
  // }, [])

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
  // useEffect(() => {
  //   return () => {
  //     console.log('断开连接')
  //   }
  // }, [])

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
