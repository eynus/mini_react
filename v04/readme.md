# fiber 架构

问题：如何做到每次之渲染几个节点呢，在下次执行的时候依然从之前的位置执行
解决思路：把树结构转变成链表结构，1.child 2.sibling 3.parent
实现：performUnitOfWork

1.  创建 dom
2.  把 dom 添加到父级容器内
3.  设置 dom 的 props
4.  建立关系 child sibling parent 6. 优先看有没有 child , 7. 没有则返回兄弟节点 sibling 8. 返回叔叔
5.  返回下一个节点

### 链表：a=>b=>d=>e=>c=>f=>g

### 更优的渲染方案：一边转变为链表一边渲染
