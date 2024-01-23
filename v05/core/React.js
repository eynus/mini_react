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
                const isTextNode = typeof child === 'string' || typeof child === 'number'
                return isTextNode ? createTextNode(child) : child
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

    root = nextWorkOfUnit //render是处理的第一个任务，记录
}

let root = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        // TODO:渲染dom的逻辑:执行完一个任务返回下一个任务
        nextWorkOfUnit = performFiberOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }

    // 如果没有后续节点，就append dom
    if (!nextWorkOfUnit && root) {
        commitRoot()
    }
    // 重新调用方法，实现在每一个任务注入回调
    requestIdleCallback(workLoop)
}
function commitRoot() {
    commitWork(root.child)
    root = null //保证只会执行一次
}

function commitWork(fiber) {
    // 递归
    if (!fiber) return

    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }

    // 处理子节点
    commitWork(fiber.child)
    commitWork(fiber.sibling)
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
function initChildren(fiber, children) {
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
    const isFunctionComponent = typeof fiber.type == 'function'

    if (!isFunctionComponent) {
        if (!fiber.dom) {
            //  1.创建dom
            const dom = (fiber.dom = createDom(fiber.type))

            // fiber.parent.dom.append(dom) //添加到父级容器

            //  2.遍历处理props
            updateProps(dom, fiber.props)
        }
    }

    const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children
    // 3.建立关系，转换链表，设置指针
    initChildren(fiber, children)
    // 4.返回下一要执行的任务
    if (fiber.child) {
        return fiber.child
    }
    // if (fiber.sibling) {
    //     return fiber.sibling
    // }
    // return fiber.parent?.sibling

    // 解决bug：相邻count 不渲染第二个的问题
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
    // return nextFiber.parent?.sibling
}
requestIdleCallback(workLoop)
const React = {
    render,
    createElement
}

export default React

// 统一提交：
// 问题：中途有可能没空余时间，用户会看到渲染一半的dom
// 解决思路：计算结束后统一添加到屏幕
// 实现
