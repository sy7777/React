import classNames from 'classnames'
import './index.scss'

const ChannelItem = ({ name, className }) => {
  return (
    <div className={classNames('channel-item', className)}>
      {name}
      <span className="icon">+</span>
    </div>
  )
}

export default ChannelItem
