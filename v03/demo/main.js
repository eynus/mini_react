const el = document.createElement('div')

el.innerText = 'heihei'

document.body.append(el)

let i = 0
while (i < 100000) {
    // 数值非常大时，会卡顿
    // js单线程，执行逻辑时会阻塞后续的渲染
    i++

    // 任务拆分，每个任务里面只去渲染两个dom
    // 借助浏览器的API requestIdleCallback
    //window.requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。
}
