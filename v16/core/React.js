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

function update() {
    let currentFiber = wipFiber
    return () => {
        console.log('currentFiber:', currentFiber) // sy
        // 新的root
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }

        nextWorkOfUnit = wipRoot
    }
}
function render(el, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [el]
        }
    }

    nextWorkOfUnit = wipRoot //render是处理的第一个任务，记录
}
// work in progress
let wipRoot = null
let nextWorkOfUnit = null
let currentRoot = null
let wipFiber = null
let deletions = []
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        // TODO:渲染dom的逻辑:执行完一个任务返回下一个任务
        nextWorkOfUnit = performFiberOfUnit(nextWorkOfUnit)

        // 当下一个任务是他的兄弟节点 时 停止
        if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
            // console.log('hit:', wipRoot, nextWorkOfUnit) // sy

            nextWorkOfUnit = undefined //跳出循环
        }

        shouldYield = deadline.timeRemaining() < 1
    }

    // 如果没有后续节点，就append dom
    if (!nextWorkOfUnit && wipRoot) {
        commitRoot()
    }
    // 重新调用方法，实现在每一个任务注入回调
    requestIdleCallback(workLoop)
}
function commitRoot() {
    // 统一删除
    deletions.forEach(commitDeletion)
    commitWork(wipRoot.child)

    commitEffectHooks()

    currentRoot = wipRoot //全部处理完之后进行的赋值，下次更新保证currentRoot是它
    wipRoot = null //保证只会执行一次
    deletions = []
}
function commitEffectHooks() {
    function run(fiber) {
        if (!fiber) return

        if (!fiber.alternate) {
            // 初始化
            fiber.effectHooks?.forEach((hook) => {
                hook.cleanup = hook.callback()
            })
        } else {
            // update   deps有米有发生改变
            fiber.effectHooks?.forEach((newHook, index) => {
                if (newHook.deps.length > 0) {
                    const oldEffectHook = fiber.alternate?.effectHooks[index]

                    const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
                        return oldDep !== newHook.deps[i]
                    })
                    needUpdate && (newHook.cleanup = newHook.callback())
                }
            })
        }

        run(fiber.child)
        run(fiber.sibling)
    }

    function runCleanup(fiber) {
        if (!fiber) return
        //  重点：之前的节点 fiber.alternate?.effectHooks
        fiber.alternate?.effectHooks?.forEach((hook) => {
            if (hook.deps.length > 0) {
                hook.cleanup && hook.cleanup()
            }
        })

        runCleanup(fiber.child)
        runCleanup(fiber.sibling)
    }
    runCleanup(wipRoot)
    run(wipRoot)
}
function commitDeletion(fiber) {
    if (fiber.dom) {
        let fiberParent = fiber.parent
        while (!fiberParent.dom) {
            fiberParent = fiberParent.parent
        }
        fiberParent.dom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child)
    }
}

function commitWork(fiber) {
    // 递归
    if (!fiber) return

    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.effectTag == 'update') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if (fiber.effectTag == 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom)
        }
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
function updateProps(dom, nextProps, prevProps) {
    // Object.keys(nextProps).forEach((key) => {
    //     if (key !== 'children') {
    //         if (key.startsWith('on')) {
    //             // onClick=> click
    //             const eventType = key.slice(2).toLowerCase()
    //             dom.addEventListener(eventType, nextProps[key])
    //         } else {
    //         dom[key] = nextProps[key]
    //         }
    //     }
    // })

    // 1.老的有 新的没有，删除
    // 2.新的有 老的没有 新增 3.都有 更新  合并成 检测值不等时，赋值
    Object.keys(prevProps).forEach((key) => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key)
            }
        }
    })
    Object.keys(nextProps).forEach((key) => {
        if (key !== 'children') {
            if (nextProps[key] !== prevProps[key]) {
                if (key.startsWith('on')) {
                    const eventType = key.slice(2).toLowerCase()
                    // 删除；否则对调用多次
                    dom.removeEventListener(eventType, prevProps[key])
                    dom.addEventListener(eventType, nextProps[key])
                } else {
                    dom[key] = nextProps[key]
                }
            }
        }
    })
}
// 3.建立关系，转换链表，设置指针
function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child
    let prevChild = null

    children.forEach((child, index) => {
        const isSameType = oldFiber && oldFiber.type == child.type
        let newFiber
        if (isSameType) {
            // 更新
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                sibling: null,
                parent: fiber,
                dom: oldFiber.dom, //diff

                effectTag: 'update',
                alternate: oldFiber
            }
        } else {
            if (child) {
                // 创建
                newFiber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    sibling: null,
                    parent: fiber,
                    dom: null,

                    effectTag: 'placement'
                }

                if (oldFiber) {
                    deletions.push(oldFiber)
                }
            }
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }
        if (newFiber) {
            //条件false不渲染的话就没有newFiber
            prevChild = newFiber
        }
    })
    // 解决删除节点：新的比老的端，多出来的节点需要删除掉
    while (oldFiber) {
        deletions.push(oldFiber)
        oldFiber = oldFiber.sibling
    }
}

function updateFunctionComponent(fiber) {
    stateHooks = []
    stateHooksIndex = 0

    effectHooks = []

    wipFiber = fiber
    const children = [fiber.type(fiber.props)]

    reconcileChildren(fiber, children)
}
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))

        updateProps(dom, fiber.props, {})
    }
    const children = fiber.props.children

    reconcileChildren(fiber, children)
}
function performFiberOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type == 'function'

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // 4.返回下一要执行的任务
    if (fiber.child) {
        return fiber.child
    }

    // 解决bug：相邻count 不渲染第二个的问题
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
}
requestIdleCallback(workLoop)

let stateHooks
let stateHooksIndex
function useState(initial) {
    let currentFiber = wipFiber

    const oldHook = currentFiber.alternate?.stateHooks[stateHooksIndex]
    const stateHook = {
        state: oldHook ? oldHook.state : initial,
        queue: oldHook ? oldHook.queue : []
    }

    // 循环调用action
    stateHook.queue.forEach((action) => {
        stateHook.state = action(stateHook.state)
    })
    stateHook.queue = []

    stateHooksIndex++
    stateHooks.push(stateHook)

    currentFiber.stateHooks = stateHooks

    function setState(action) {
        // 提前检测，减少没必要的更新
        const eagerState = typeof action == 'function' ? action(stateHook.state) : action

        if (eagerState == stateHook.state) return
        // stateHook.state = action(stateHook.state)
        stateHook.queue.push(typeof action == 'function' ? action : () => action)

        // 设置fiber节点
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }

        nextWorkOfUnit = wipRoot
    }
    return [stateHook.state, setState]
}
let effectHooks
function useEffect(callback, deps) {
    const effectHook = {
        callback,
        deps
    }
    effectHooks.push(effectHook)
    wipFiber.effectHooks = effectHooks
}
const React = {
    render,
    update,
    useState,
    useEffect,
    createElement
}

export default React
