import { useRef } from 'react'

const App = () => {
  const inputRef = useRef(null)

  // 注意：不要在组件渲染时，使用 ref 进行 DOM 操作
  console.log(inputRef.current)

  return (
    <div>
      <input ref={inputRef} />
      <hr />
      <button onClick={() => console.log(inputRef.current.value)}>
        获取文本框的值
      </button>
      <button onClick={() => inputRef.current.focus()}>获得焦点</button>
    </div>
  )
}

export default App
