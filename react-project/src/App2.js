import {useState} from 'react';
import {useRef} from 'react';
import './App.scss'
import avatar from './images/bozai.png'
import dayjs from 'dayjs'
import orderBy from 'lodash/orderBy'

/**
 * render comment list and action
 *
 * 1. render comment based on state
 * 2. delete comment
 * 3. like or dislik
 */

// comment list
const defaultList = [
  {
    // comment id
    rpid: 3,
    // user info
    user: {
      uid: '13258165',
      avatar:
        'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/zhoujielun.jpeg',
      uname: 'Jay Chou',
    },
    // content
    content: 'Cool',
    // time
    ctime: '10-18 08:15',
    // number of like
    like: 98,
    // 0：no state 1: like 2: dislike
    action: 0,
  },
  {
    rpid: 2,
    user: {
      uid: '36080105',
      avatar:
        'https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/xusong.jpeg',
      uname: 'Xu song',
    },
    content: 'God',
    ctime: '11-13 11:29',
    like: 88,
    action: 2,
  },
  {
    rpid: 1,
    user: {
      uid: '30009257',
      avatar,
      uname: 'Black Horse',
    },
    content: 'Welcome to here',
    ctime: '10-19 09:00',
    like: 66,
    action: 1,
  },
]
// current use info
const user = {
  uid: '30009257',
  avatar,
  uname: '黑马前端',
}

/**
 * nav Tab
 *
 * 1. 渲染导航 Tab 和高亮
 * 2. 评论列表排序
 *  最热 => 喜欢数量降序
 *  最新 => 创建时间降序
 */

// 导航 Tab 数组
const tabs = [
  { type: 'hot', text: 'Hot' },
  { type: 'time', text: 'New' },
]

const App = () => {
  // highlight
  const [activeTab, setActiveTab] = useState('hot')
  const [list, setList] = useState(defaultList)

  // delete
  const onDelete = rpid => {
    // 如果要删除数组中的元素，需要调用 filter 方法，并且一定要调用 setList 才能更新状态
    setList(list.filter(item => item.rpid !== rpid))
  }

  // Like
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

  // dislike
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

// comment area
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  // add new comment
  const addComment=()=>{
    if(value.trim() ===''){
      return textAreaRef.current.focus();
    }
    const comment = {
      rpid : Date.now(),
      user,
      content: value,
      ctime: dayjs().format('MM-DD HH:mm'),
      like:0,
      action:0
    }
    const newList = [comment, ...list];
    if(activeTab === 'time'){
      setList(orderBy(newList, 'ctime', 'aesc'))
    }else{
      setList(orderBy(newList, 'like', 'desc'))
    }
    setValue('');

  }
  const textAreaRef=useRef(null);
  const inpuRef=useRef(null);
  return (

    <div className="app">
      {/* navTab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">Comment</span>
            {/* comment number */}
            <span className="total-reply">{list.length}</span>
          </li>
          <li className="nav-sort">
            {/* highlight classname： active */}
            {tabs.map(item => {
              return (
                <div
                  key={item.type}
                  className={
                    item.type === activeTab ? 'nav-item active' : 'nav-item'
                  }
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
              placeholder="add your comment"
              value={value}
              onChange={e=>setValue(e.target.value)}
              ref={textAreaRef}
            />
            {/* 发布按钮 */}
            <div className="reply-box-send">
              <div className="send-text" onClick={()=>
                addComment() 
              }>Publish</div>
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
                          className={
                            item.action === 1
                              ? 'icon like-icon liked'
                              : 'icon like-icon'
                          }
                          onClick={() => onLike(item.rpid)}
                        />
                        <span>{item.like}</span>
                      </span>
                      {/* 不喜欢 */}
                      <span className="reply-dislike">
                        {/* 选中类名： disliked */}
                        <i
                          className={
                            item.action === 2
                              ? 'icon dislike-icon disliked'
                              : 'icon dislike-icon'
                          }
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

      <div>
        {/* value and onchange exist at the same time */}
        <input value={value} onChange={e=>setValue(e.target.value)} />
        <button onClick={()=>alert(value)}>Get</button>
        <button onClick={()=>setValue('changed value')}>Change</button>
        <hr />
        <input type="checkbox" checked={checked} onChange={(e)=>{setChecked(e.target.checked)}} />
        {checked ? 'checked':'unchecked'}
      </div>

      <div>
        <input ref={inpuRef}></input>
        <hr/>
        <button onClick={()=>console.log(inpuRef.current.value)}>get value</button>
        <button onClick={()=>console.log(inpuRef.current.focus())}>get focus</button>
      </div>
    </div>
  )
}

export default App;