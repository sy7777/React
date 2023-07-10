// 使用 classnames 优化类名处理
// 按钮的样式：
//  btn btn-disabled btn-small btn-large

import { useState } from 'react'

import classNames from 'classnames'

const App = () => {
  // 是否禁用
  const [disabled, setDisabled] = useState(false)
  // 大小
  const [size, setSize] = useState('small')

  return (
    <div>
      {/* 逻辑与 && --- 适用于处理单个类名*/}
      <button className={classNames('btn', disabled && 'btn-disabled')}>
        按钮
      </button>

      {/* 对象语法 --- 适用于处理多个类名 */}
      <button
        className={classNames('btn', {
          'btn-disabled': disabled,
          'btn-small': size === 'small',
          'btn-large': size === 'large',
        })}
      >
        按钮
      </button>
      <hr />
      <div>
        操作：
        <button onClick={() => setDisabled(true)}>禁用</button>
        <button onClick={() => setSize('small')}>变小</button>
        <button onClick={() => setSize('large')}>变大</button>
      </div>
    </div>
  )
}

export default App
