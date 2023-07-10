// React Hooks 解释和使用规则

import { useState } from 'react'

const App = () => {
  // 错误：
  // if (Math.random() > 0.5) {
  //   const [count, setCount] = useState(0)
  // }

  // 正确：
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>计数器：{count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

export default App
