import { useState } from "react";
import "./App.scss";
import classNames from "classnames";

//child component
const Todo = ({ id, text, done, onToggle, onDelete}) => {
  console.log(onToggle);
  return (
    <div className={classNames("todo", done && "todo-done")}>
      <div
        onClick={() => {
          onToggle(id);
        }}
      >
        {text}
      </div>
      <button onClick={()=>{
        onDelete(id)
      }}>X</button>
    </div>
  );
};

// task details
const defaultTodos = [
  { id: 1, text: "learning", done: false },
  { id: 2, text: "rest", done: true },
  { id: 3, text: "eating", done: false },
];

// father component
const App = () => {
  const [todos, setTodos] = useState(defaultTodos);
  const onToggle = (id) => {
    // console.log(id);
    setTodos(
      todos.map((item) => {
        if (item.id === id) {
          return { ...item, done: !item.done };
        }
        return item;
      })
    );
  };
  const onDelete = (id)=>{
    setTodos(todos.filter(item=>item.id !== id))
  }
  return (
    <div className="app">
      <h3> To do lists: </h3>
      {todos.map((item) => {
        return (
          <Todo
            key={item.id}
            id={item.id}
            text={item.text}
            done={item.done}
            onToggle={onToggle}
            onDelete={onDelete}
          ></Todo>
        );
      })}
    </div>
  );
};
export default App;
