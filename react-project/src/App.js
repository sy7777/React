import {useState} from 'react';


const App = ()=>{
    const [count, setCount] = useState(10)
    const [list, setList] = useState(['banana','apple'])
    return(
        <div>
            <div>
                <h1>Counter: {count}</h1>
                <button onClick={()=>setCount(count+1)}>+1</button>
            </div>
            <hr/>
            <div>
                <h1>List: {list.join(",")}</h1>
                {/* 不能用push因为数组必须渲染新的 */}
                <button onClick={()=>setList([...list,'pear'])}>Add</button>
                <button onClick={()=>setList(list.filter(i=>i !== 'pear'))}>Delete</button>
                <button onClick={()=>setList(list.map(item =>{
                    if(item === 'pear'){
                        return 'orange';
                    }
                    return item;
                }))}>Change</button>
            </div>
            <hr/>
        </div>


    )
}
export default App;