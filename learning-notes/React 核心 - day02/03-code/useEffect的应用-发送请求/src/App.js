import './App.scss'
import classNames from 'classnames'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

// useEffect 发送请求

// 子组件
const Todo = ({ id, text, done, onToggle }) => {
  return (
    <div className={classNames('todo', done && 'todo-done')}>
      <div onClick={() => onToggle(id, !done)}>{text}</div>
      <button>X</button>
    </div>
  )
}

// 任务列表数据
const defaultTodos = []

// 父组件
const App = () => {
  const [todos, setTodos] = useState(defaultTodos)

  // 注意：不要直接在 Effect函数 上添加 async ，因为 Effect 函数是同步的
  useEffect(() => {
    const loadData = async () => {
      const res = await axios.get('http://localhost:8080/todos')
      setTodos(res.data)
    }
    loadData()
  }, [])

  // 切换任务完成状态
  const onToggle = async (id, done) => {
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

    await axios.patch(`http://localhost:8080/todos/${id}`, {
      done,
    })
    // const res = await axios.patch(`http://localhost:8080/todos/${id}`, {
    //   done,
    // })
    // console.log(res)
  }

  return (
    <div className="app">
      <h3>待办任务列表：</h3>
      {todos.map(item => {
        return <Todo key={item.id} {...item} onToggle={onToggle} />
      })}
    </div>
  )
}

export default App
