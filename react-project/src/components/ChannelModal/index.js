import classNames from 'classnames'
import ChannelItem from '../ChannelItem'
import './index.scss'
import ChannelHeader from '../ChannelHeader'

const ChannelModal = ({ visible, onClose }) => {
  return (
    <div className="channels" style={{ display: visible ? 'block' : 'none' }}>
      <div className="header">
        <span>全部板块</span>
        <span className="close" onClick={onClose}>
          x
        </span>
      </div>
      <div className="content">
        <ChannelHeader
          title="我的板块"
          info="点击进入板块"
          extra={<span>编辑</span>}
        />
        <div className={classNames('list', false && 'edit')}>
          <ChannelItem name="全站" />
          <ChannelItem name="直播" />
          <ChannelItem name="高赞" />
        </div>

        <ChannelHeader title="更多板块" info="点击添加板块" />
        <div className="list">
          <ChannelItem name="校园" className="more-item" />
          <ChannelItem name="电竞" className="more-item" />
          <ChannelItem name="心理" className="more-item" />
          {/* <div className="no-more">已全部添加至我的板块</div> */}
        </div>
      </div>
    </div>
  )
}

export default ChannelModal
