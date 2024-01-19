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
    workOfUnit = {}

    // //  1.创建dom
}

let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield) {
        // TODO:渲染dom的逻辑:执行完一个任务返回下一个任务
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }

    // 重新调用方法，实现在每一个任务注入回调
    requestIdleCallback(workLoop)
}

function performWorkOfUnit(work) {
    //  1.创建dom
    const dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(work.type)

    work.parent.dom.append(dom) //添加到父级容器

    //  2.遍历处理props
    Object.keys(work.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = work.props[key]
        }
    })
    // 3.建立关系，转换链表，设置指针
    const children = work.props.children
    let prevChild = null

    children.forEach((child, index) => {
        // 为了不破坏原有的vnode结构，先建一个对象
        const newWork = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            parent: work,
            dom: null
        }
        if (index === 0) {
            work.child = newWork
        } else {
            prevChild.sibling = newWork
        }
        prevChild = newWork
    })
    // 4.返回下一要执行的任务
    if (work.child) {
        return work.child
    }
    if (work.sibling) {
        return work.sibling
    }
    return work.parent?.sibling
}
requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React
