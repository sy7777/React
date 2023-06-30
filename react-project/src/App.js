import {useState} from 'react';
import './App.scss'
import avatar11 from './images/bozai.png'

import orderBy from 'lodash/orderBy'
const App=()=>{
    return(
        <div className='app'>
            App Componets
            <img src={avatar11} alt=''/>
        </div>
    )
}
export default App;