// v1
// const dom = document.createElement('dom')
// console.log('dom:', dom) // sy
// dom.id = 'app'
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = 'app'
// dom.append(textNode)

// v2 react -  vdom - js obj
// const obj = [
//     {
//         type: 'div',
//         props: {
//             id: 'app',
//             children: [
//                 {
//                     type: 'TEXT_ELEMENT',
//                     props: {
//                         nodeValue: 'app',
//                         children: []
//                     }
//                 }
//             ]
//         }
//     }
// ]
// const textEl = {
//     type: 'TEXT_ELEMENT',
//     props: {
//         nodeValue: 'app_text',
//         children: []
//     }
// }

// const el = [
//     {
//         type: 'div',
//         props: {
//             id: 'app',
//             children: [textEl]
//         }
//     }
// ]
// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// 动态创建
function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === 'string' ? createTextNode(child) : child
            })
        }
    }
}

// // 创建dom节点
// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').append(dom)
// // 创建dom节点
// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// 1.创建dom
// 2.添加属性
// 3.append
function render(el, container) {
    //  1.创建dom
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
    // 遍历 2.添加属性
    Object.keys(el.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })
    // 处理孩子节点
    const children = el.props.children
    children.forEach((child) => {
        render(child, dom)
    })
    //  3.append
    container.append(dom)
}

const textEl = createTextNode('app_text')

// const App = createElement(
//     'div',
//     {
//         id: 'app'
//     },
//     'mini-react'
// )
// console.log('App:', App) // sy
// render(App, document.querySelector('#root'))

// React版本改写：
// const ReactDom = {
//     createRoot(container) {
//         return {
//             render(App) {
//                 render(App, container)
//             }
//         }
//     }
// }
// const App = createElement(
//     'div',
//     {
//         id: 'app'
//     },
//     'mini-react'
// )
// ReactDom.createRoot(document.querySelector('#root')).render(App)

// 拆分：业务代码  框架代码 core/react.js
// import React from './core/React.js'
// import ReactDom from './core/ReactDom.js'

// const App = React.createElement(
//     'div',
//     {
//         id: 'app'
//     },
//     'mini-react11'
// )
// ReactDom.createRoot(document.querySelector('#root')).render(App)

// 进一步：还需要一个app.js
import App from './App.js'
import ReactDom from './core/ReactDom.js'

ReactDom.createRoot(document.querySelector('#root')).render(App)
