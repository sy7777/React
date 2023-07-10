import classNames from 'classnames'
import { useState } from 'react'
import './App.scss'

// 兄弟组件通讯

// 左侧 好友列表组件
const Friends = ({ friends, onSelect, chatFriend }) => {
  return (
    <div className="friends">
      {friends.map(item => {
        return (
          <div
            key={item.id}
            className={classNames(
              'friend',
              item.id === chatFriend.id && 'selected'
            )}
            onClick={() => onSelect(item)}
          >
            <img src={item.avatar} className="avatar" alt="" />
            <div className="info">
              <div className="row">
                <div className="name">{item.name}</div>
                <div className="date">{item.dateStr}</div>
              </div>
              <div className="msg">{item.message}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 右侧 聊天窗口组件
const Chat = ({ friend }) => {
  return (
    <div className="chat-wrapper">
      <div className="header">{friend.name}</div>
      <div className="list"></div>
      <div className="input"></div>
    </div>
  )
}

// 好友列表数据
const defaultFriends = [
  {
    id: '13258165',
    name: '周杰伦',
    avatar:
      'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/zhoujielun.jpeg',
    dateStr: '刚刚',
    message: '哎呦，不错哦',
  },
  {
    id: '36080105',
    name: '许嵩',
    avatar:
      'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/xusong.jpeg',
    dateStr: '01/05',
    message: '[语音]',
  },
]
// 父组件
const App = () => {
  const [friends, setFriends] = useState(defaultFriends)

  // 1. 找到父组件，提供要共享的数据
  const [chatFriend, setChatFriend] = useState(friends[0])

  const onSelectFriend = friend => {
    setChatFriend(friend)
  }

  return (
    <div className="app">
      {/* 好友列表 */}
      {/* 3. 通过子到父通讯，来修改选中的好友 */}
      <Friends
        friends={friends}
        onSelect={onSelectFriend}
        chatFriend={chatFriend}
      />
      {/* 聊天窗口 */}
      {/* 2. 通过父到子通讯，来展示好友名称 */}
      <Chat friend={chatFriend} />
    </div>
  )
}

export default App
