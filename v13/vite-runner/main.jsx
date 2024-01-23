import App from './App.jsx'
import React from '../core/React.js'
import ReactDom from '../core/ReactDom.js'


// TODO：暂时还没有支持function component 等到后面
// ReactDom.createRoot(document.querySelector('#root')).render(<App ></App>) //jsx只能在.jsx文件中写
ReactDom.createRoot(document.querySelector('#root')).render(<App/>) //jsx只能在.jsx文件中写
