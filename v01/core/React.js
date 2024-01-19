// render creatDom

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

const React = {
    render,
    createElement
}

export default React
