import './index.scss'

const ChannelHeader = ({ title, info, extra }) => {
  return (
    <div className="channelHeader">
      <div className="header">
        <span>{title}</span>
        <span className="headerDesc">{info}</span>
      </div>
      {extra && <div className="opration">{extra}</div>}
    </div>
  )
}

export default ChannelHeader
