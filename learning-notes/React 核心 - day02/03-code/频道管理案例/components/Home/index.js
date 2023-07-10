import { useContext } from 'react'
import { useState } from 'react'
import { ChannelContext } from '../../ChannelContext'
import ChannelModal from '../ChannelModal'
import './index.scss'

const Home = () => {
  // 控制弹窗展示或隐藏的状态
  const [visible, setVisible] = useState(false)

  const { myChannels } = useContext(ChannelContext)

  // console.log('Home', myChannels)

  return (
    <div className="home">
      <div className="home-channels">
        <div className="list">
          {myChannels.map(item => (
            <div key={item.id} className="item">
              {item.name}
            </div>
          ))}
        </div>
        <div className="more" onClick={() => setVisible(true)}>
          ≡
        </div>
      </div>
      <div className="content" />
      {/* 频道弹窗 */}
      <ChannelModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  )
}

export default Home
