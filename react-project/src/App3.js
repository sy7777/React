import {useState} from 'react';
import './App.scss'
// 2. receive props
// const Avatar = props=>{
//     console.log(props);
//     return(<img src={props.imgUrl}/>)
// }

// deconstructure with default value 50,
const Avatar = ({imgUrl, size=50})=>{
    return(<img src={imgUrl} width={size}/>)
}
const App = ()=>{
    return(
        <div>
            {/* commit props,{ for number not string} */}
            <Avatar imgUrl="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/zhoujielun.jpeg" size={100}/>
            <Avatar imgUrl="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/comment/zhoujielun.jpeg"/>
        </div>
        
    )
}
export default App;