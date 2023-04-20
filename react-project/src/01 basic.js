/*
1.导入react react-dom
2.通过react的API 创建react元素 虚拟DOM
3.把react元素渲染到页面
*/
import React from 'react';
import ReactDOM from 'react-dom';
/*
<h1 id="box">我是内容<h1>
参数一：标签的名字H1 p div
参数2：标签的属性，对象
参数3：标签的内容
*/ 
const element = React.createElement('h1',{id:'box',title:'hahah'},'am the content');
ReactDOM.render(element,document.getElementById('root'));

const element2 = React.createElement('div',{id:'demo',className:'aa'},'am the content 2');
ReactDOM.render(element2,document.getElementById('root'))