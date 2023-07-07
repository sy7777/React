import classNames from 'classnames'
import ChannelItem from '../ChannelItem'
import './index.scss'
import ChannelHeader from '../ChannelHeader'
import { useContext } from 'react'
import { ChannelContext } from '../../ChannelContext'
import { useState } from 'react'

const ChannelModal = ({ visible, onClose }) => {
  const { myChannels, moreChannels, onUpdateChannel } =
    useContext(ChannelContext)

  // 1. 切换编辑或完成状态
  const [isEdit, setIsEdit] = useState(false)

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
          extra={
            <span onClick={() => setIsEdit(!isEdit)}>
              {isEdit ? '完成' : '编辑'}
            </span>
          }
        />
        <div className={classNames('list', isEdit && 'edit')}>
          {myChannels.map(item => (
            <ChannelItem
              key={item.id}
              name={item.name}
              // 2. 处理不可编辑频道
              canEdit={item.canEdit}
              onClick={() => {
                if (isEdit && item.canEdit) {
                  onUpdateChannel(item.id, !item.selected)
                }
              }}
            />
          ))}
        </div>

        <ChannelHeader title="更多板块" info="点击添加板块" />
        <div className="list">
          {moreChannels.length > 0 ? (
            moreChannels.map(item => (
              <ChannelItem
                key={item.id}
                name={item.name}
                className="more-item"
                canEdit={item.canEdit}
                onClick={() => onUpdateChannel(item.id, !item.selected)}
              />
            ))
          ) : (
            <div className="no-more">已全部添加至我的板块</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChannelModal
