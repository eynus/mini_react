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
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        // TODO:渲染dom的逻辑:执行完一个任务返回下一个任务
        nextWorkOfUnit = performFiberOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }

    // 重新调用方法，实现在每一个任务注入回调
    requestIdleCallback(workLoop)
}
// 封装创建dom
function createDom(type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}
// 封装处理props
function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}
// 3.建立关系，转换链表，设置指针
function initChildren(fiber) {
    const children = fiber.props.children
    let prevChild = null

    children.forEach((child, index) => {
        // 为了不破坏原有的vnode结构，先建一个对象
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            parent: fiber,
            dom: null
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
}
function performFiberOfUnit(fiber) {
    if (!fiber.dom) {
        //  1.创建dom
        const dom = (fiber.dom = createDom(fiber.type))

        fiber.parent.dom.append(dom) //添加到父级容器

        //  2.遍历处理props
        updateProps(dom, fiber.props)
    }

    // 3.建立关系，转换链表，设置指针
    initChildren(fiber)
    // 4.返回下一要执行的任务
    if (fiber.child) {
        return fiber.child
    }
    if (fiber.sibling) {
        return fiber.sibling
    }
    return fiber.parent?.sibling
}
requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React
