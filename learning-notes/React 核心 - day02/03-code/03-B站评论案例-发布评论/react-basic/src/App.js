import { useState } from 'react'
import './App.scss'
import avatar from './images/bozai.png'

import orderBy from 'lodash/orderBy'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useRef } from 'react'

/**
 * 评论列表的渲染和操作
 *
 * 1. 根据状态渲染评论列表
 * 2. 删除评论
 * 3. 喜欢和不喜欢
 */

// 评论列表数据
const defaultList = [
  {
    // 评论id
    rpid: 3,
    // 用户信息
    user: {
      uid: '13258165',
      avatar:
        'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/zhoujielun.jpeg',
      uname: '周杰伦',
    },
    // 评论内容
    content: '哎哟，不错哦',
    // 评论时间
    ctime: '10-18 08:15',
    // 喜欢数量
    like: 98,
    // 0：未表态 1: 喜欢 2: 不喜欢
    action: 0,
  },
  {
    rpid: 2,
    user: {
      uid: '36080105',
      avatar:
        'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/xusong.jpeg',
      uname: '许嵩',
    },
    content: '我寻你千百度 日出到迟暮',
    ctime: '11-13 11:29',
    like: 88,
    action: 2,
  },
  {
    rpid: 1,
    user: {
      uid: '30009257',
      avatar,
      uname: '黑马前端',
    },
    content: '学前端就来黑马',
    ctime: '10-19 09:00',
    like: 66,
    action: 1,
  },
]
// 当前登录用户信息
const user = {
  // 用户id
  uid: '30009257',
  // 用户头像
  avatar,
  // 用户昵称
  uname: '黑马前端',
}

/**
 * 导航 Tab 的渲染和操作
 *
 * 1. 渲染导航 Tab 和高亮
 * 2. 评论列表排序
 *  最热 => 喜欢数量降序
 *  最新 => 创建时间降序
 */

// 导航 Tab 数组
const tabs = [
  { type: 'hot', text: '最热' },
  { type: 'time', text: '最新' },
]

/**
 * 发布评论
 *
 * 1. 获取评论内容 - 受控组件
 * 2. 发布评论
 *  2.1 有内容，发布评论，同时排序
 *  2.2 无内容，获得焦点，提升体验
 */

const App = () => {
  // 导航 Tab 高亮的状态
  const [activeTab, setActiveTab] = useState('hot')
  const [list, setList] = useState(defaultList)

  // 评论框的状态
  const [value, setValue] = useState('')

  // 评论框的 ref 对象
  const textRef = useRef(null)

  const onAdd = () => {
    // 判断评论框内容是否为空
    if (value.trim() === '') {
      return textRef.current.focus()
    }

    // 组装评论数据
    const comment = {
      rpid: Date.now(),
      user,
      content: value,
      ctime: dayjs().format('MM-DD HH:mm'),
      like: 0,
      action: 0,
    }

    // 添加到评论列表 list 状态中
    const newList = [comment, ...list]

    // 排序
    if (activeTab === 'time') {
      // 最新
      // 更新状态
      setList(orderBy(newList, 'ctime', 'desc'))
    } else {
      // 最热
      setList(orderBy(newList, 'like', 'desc'))
    }

    // 清空评论框的内容
    setValue('')
  }

  // 删除评论
  const onDelete = rpid => {
    // 如果要删除数组中的元素，需要调用 filter 方法，并且一定要调用 setList 才能更新状态
    setList(list.filter(item => item.rpid !== rpid))
  }

  // 喜欢
  const onLike = rpid => {
    setList(
      list.map(item => {
        if (item.rpid === rpid) {
          return {
            ...item,
            // 高亮 action
            action: item.action === 1 ? 0 : 1,
            // 喜欢数量 like
            like: item.action === 1 ? item.like - 1 : item.like + 1,
          }
        }
        return item
      })
    )
  }

  // 不喜欢
  const onDislike = rpid => {
    setList(
      list.map(item => {
        if (item.rpid === rpid) {
          return {
            ...item,
            // 高亮 action
            action: item.action === 2 ? 0 : 2,
            // 喜欢数量 like
            // 判断当前是否喜欢，如果喜欢，就让数量 - 1；如果没有喜欢，数量不变
            like: item.action === 1 ? item.like - 1 : item.like,
          }
        }
        return item
      })
    )
  }

  // tab 高亮切换
  const onToggle = type => {
    setActiveTab(type)

    let newList
    if (type === 'time') {
      // 按照时间降序排序
      // orderBy(对谁进行排序, 按照谁来排, 顺序)
      newList = orderBy(list, 'ctime', 'desc')
    } else {
      // 按照喜欢数量降序排序
      newList = orderBy(list, 'like', 'desc')
    }
    setList(newList)
  }

  return (
    <div className="app">
      {/* 导航 Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">评论</span>
            {/* 评论数量 */}
            <span className="total-reply">{list.length}</span>
          </li>
          <li className="nav-sort">
            {/* 高亮类名： active */}
            {tabs.map(item => {
              return (
                <div
                  key={item.type}
                  className={classNames(
                    'nav-item',
                    item.type === activeTab && 'active'
                  )}
                  onClick={() => onToggle(item.type)}
                >
                  {item.text}
                </div>
              )
            })}
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* 发表评论 */}
        <div className="box-normal">
          {/* 当前用户头像 */}
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={avatar} alt="用户头像" />
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* 评论框 */}
            <textarea
              className="reply-box-textarea"
              placeholder="发一条友善的评论"
              value={value}
              onChange={e => setValue(e.target.value)}
              ref={textRef}
            />
            {/* 发布按钮 */}
            <div className="reply-box-send" onClick={onAdd}>
              <div className="send-text">发布</div>
            </div>
          </div>
        </div>
        {/* 评论列表 */}
        <div className="reply-list">
          {/* 评论项 */}
          {list.map(item => {
            return (
              <div key={item.rpid} className="reply-item">
                {/* 头像 */}
                <div className="root-reply-avatar">
                  <div className="bili-avatar">
                    <img
                      className="bili-avatar-img"
                      src={item.user.avatar}
                      alt=""
                    />
                  </div>
                </div>

                <div className="content-wrap">
                  {/* 用户名 */}
                  <div className="user-info">
                    <div className="user-name">{item.user.uname}</div>
                  </div>
                  {/* 评论内容 */}
                  <div className="root-reply">
                    <span className="reply-content">{item.content}</span>
                    <div className="reply-info">
                      {/* 评论时间 */}
                      <span className="reply-time">{item.ctime}</span>
                      {/* 喜欢 */}
                      <span className="reply-like">
                        {/* 选中类名： liked */}
                        <i
                          className={classNames(
                            'icon like-icon',
                            item.action === 1 && 'liked'
                          )}
                          onClick={() => onLike(item.rpid)}
                        />
                        <span>{item.like}</span>
                      </span>
                      {/* 不喜欢 */}
                      <span className="reply-dislike">
                        {/* 选中类名： disliked */}
                        <i
                          className={classNames(
                            'icon dislike-icon',
                            item.action === 2 && 'disliked'
                          )}
                          onClick={() => onDislike(item.rpid)}
                        />
                      </span>
                      {user.uid === item.user.uid && (
                        <span
                          className="delete-btn"
                          onClick={() => onDelete(item.rpid)}
                        >
                          删除
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {list.length === 0 && <div className="reply-none">暂无评论</div>}{' '}
      </div>
    </div>
  )
}

export default App
