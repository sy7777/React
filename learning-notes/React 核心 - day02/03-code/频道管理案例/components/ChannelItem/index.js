import classNames from 'classnames'
import './index.scss'

const ChannelItem = ({ name, className, canEdit, onClick }) => {
  return (
    <div className={classNames('channel-item', className)} onClick={onClick}>
      {name}
      {canEdit && <span className="icon">+</span>}
    </div>
  )
}

export default ChannelItem
