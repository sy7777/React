import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { ChannelContext } from './ChannelContext'
import Home from './components/Home'

const App = () => {
  // 1. 获取频道数据
  const [channels, setChannels] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get('http://localhost:8000/channels')
      setChannels(res.data)
    }
    loadData()
  }, [])

  // 提供数据
  // 1. 选中的频道数据
  const myChannels = channels.filter(item => item.selected)
  // 2. 未选中的频道数据
  const moreChannels = channels.filter(item => !item.selected)
  // console.log(myChannels, moreChannels)

  // 更新频道选中状态的函数
  const onUpdateChannel = (id, selected) => {
    setChannels(
      channels.map(item => {
        if (id === item.id) {
          return {
            ...item,
            selected,
          }
        }
        return item
      })
    )
  }

  return (
    <ChannelContext.Provider
      value={{ myChannels, moreChannels, onUpdateChannel }}
    >
      <div className="app">
        <Home />
      </div>
    </ChannelContext.Provider>
  )
}

export default App
