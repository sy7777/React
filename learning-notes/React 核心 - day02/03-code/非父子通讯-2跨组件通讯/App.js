import { useContext, useState } from 'react'
import { createContext } from 'react'
import './App.scss'

// 跨组件通讯 - Context
// 1. 创建 Context 对象
const ThemeContext = createContext()

// 2. 划定范围，提供共享数据
// 3. 范围内的组件，获取共享数据

// -------------------------侧边栏-----------------------
const Sidebar = () => {
  return (
    <div className="sidebar">
      <Menu />
    </div>
  )
}
const Menu = () => {
  return (
    <div className="menu">
      <ul>
        <MenuItem />
        <MenuItem />
      </ul>
    </div>
  )
}
const MenuItem = () => {
  // 3. 范围内的组件，获取共享数据
  const { theme } = useContext(ThemeContext)
  return <li style={{ color: theme }}>菜单</li>
}

// -------------------------右侧内容-----------------------
const Content = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="content">
      <div className="main" style={{ color: theme }}>
        Context 跨组件通讯
      </div>
      <Footer />
    </div>
  )
}
const Footer = () => {
  const { onReset } = useContext(ThemeContext)

  return (
    <div className="footer">
      <button onClick={onReset}>重置主题</button>
    </div>
  )
}

// 父组件
const App = () => {
  // 要共享的主题颜色
  const [theme, setTheme] = useState('#1677FF')

  // 重置主题的函数
  const onReset = () => {
    setTheme('#1677FF')
  }

  return (
    <div className="app">
      {/* 2. 划定范围，提供共享数据 */}
      <ThemeContext.Provider
        value={{
          theme,
          onReset,
          // ...
        }}
      >
        {/* 默认颜色： #1677FF */}
        <input
          className="theme-selector"
          type="color"
          value={theme}
          onChange={e => setTheme(e.target.value)}
        />

        <div className="main">
          {/* 侧边栏 */}
          <Sidebar />
          {/* 右侧内容 */}
          <Content />
        </div>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
