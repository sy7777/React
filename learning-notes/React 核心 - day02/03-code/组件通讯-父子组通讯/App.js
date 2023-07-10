import './App.scss'
import classNames from 'classnames'
import { useState } from 'react'

// 父子组件通讯
// 1. 父 → 子（功能：渲染任务列表）
// 2. 子 → 父（功能：切换任务完成状态）
//  2.1 父组件准备修改状态的函数，并传递给子组件
//  2.2 子组件调用函数，并回传数据

// 子组件
const Todo = ({ id, text, done, onToggle }) => {
  return (
    <div className={classNames('todo', done && 'todo-done')}>
      <div onClick={() => onToggle(id)}>{text}</div>
      <button>X</button>
    </div>
  )
}

// 任务列表数据
const defaultTodos = [
  { id: 1, text: '学习React', done: false },
  { id: 2, text: '休息', done: true },
  { id: 3, text: '吃饭', done: false },
]
// 父组件
const App = () => {
  const [todos, setTodos] = useState(defaultTodos)

  const onToggle = id => {
    setTodos(
      todos.map(item => {
        if (item.id === id) {
          return {
            ...item,
            done: !item.done,
          }
        }
        return item
      })
    )
  }

  return (
    <div className="app">
      <h3>待办任务列表：</h3>
      {todos.map(item => {
        return <Todo key={item.id} {...item} onToggle={onToggle} />
        // return (
        //   <Todo
        //     key={item.id}
        //     id={item.id}
        //     text={item.text}
        //     done={item.done}
        //     onToggle={onToggle}
        //   />
        // )
      })}
    </div>
  )
}

export default App
