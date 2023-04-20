import React from 'react';
import ReactDOM from 'react-dom';

// create element
const element = React.createElement(
    'ul',
    {className:'list'},
    // '<li>banana</li>'
    [
        React.createElement('li',null,'banana'),
        React.createElement('li',null,'apple'),
        React.createElement('li',null,'orange'),
        React.createElement('li','xxxx'),
    ]
)
ReactDOM.render(element,document.getElementById('root'));