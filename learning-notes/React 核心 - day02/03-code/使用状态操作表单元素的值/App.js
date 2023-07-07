import { useState } from 'react'
import './App.css'

// 使用状态操作表单元素的值

const App = () => {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  return (
    <div>
      {/* 注意： value 和 onChange 需要同时出现 */}
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={() => alert(value)}>获取</button>
      <button onClick={() => setValue('黑马')}>修改</button>

      <hr />

      <input
        type="checkbox"
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
      />
      {checked ? '选中了' : '未选中'}
    </div>
  )
}

export default App
