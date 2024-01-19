// 任务调度器
// 问题：dom树特别大，导致渲染卡顿
// 解决思路：任务拆分到多个task里面完成
// 实现：采用requestIdleCallback分帧运算
let taskId = 1
function workLoop(deadline) {
    taskId++

    // 任务时间
    console.log(deadline.timeRemaining())

    let shouldYield = false
    while (!shouldYield) {
        // run task
        console.log(`taskId:${taskId} run task`)

        // TODO:渲染dom的逻辑

        shouldYield = deadline.timeRemaining() < 1
    }

    // 重新调用方法，实现在每一个任务注入回调
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
