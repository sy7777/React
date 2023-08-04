import { useState } from 'react'
import ChannelModal from '../ChannelModal'
import './index.scss'

const Home = () => {
  // 控制弹窗展示或隐藏的状态
  const [visible, setVisible] = useState(false)

  return (
    <div className="home">
      <div className="home-channels">
        <div className="list">
          <div className="item">全站</div>
          <div className="item">直播</div>
          <div className="item">高赞</div>
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
