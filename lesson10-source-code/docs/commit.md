## commit阶段
``commit`阶段会将`Fiber树`渲染到页面上

### commitRoot
```js
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

### commitRootImpl
```js
// ... 省略部分无关代码
function commitRootImpl(root, renderPriorityLevel) {
  // ============ 渲染前: 准备 ============

  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  // 清空FiberRoot对象上的属性
  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  root.callbackNode = null;

  if (root === workInProgressRoot) {
    // 重置全局变量
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  }

  // 再次更新副作用队列
  let firstEffect;
  if (finishedWork.flags > PerformedWork) {
    // 默认情况下fiber节点的副作用队列是不包括自身的
    // 如果根节点有副作用, 则将根节点添加到副作用队列的末尾
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    firstEffect = finishedWork.firstEffect;
  }

  // ============ 渲染 ============
  let firstEffect = finishedWork.firstEffect;
  if (firstEffect !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    // 阶段1: dom突变之前
    nextEffect = firstEffect;
    do {
      commitBeforeMutationEffects();
    } while (nextEffect !== null);

    // 阶段2: dom突变, 界面发生改变
    nextEffect = firstEffect;
    do {
      commitMutationEffects(root, renderPriorityLevel);
    } while (nextEffect !== null);
    // 恢复界面状态
    resetAfterCommit(root.containerInfo);
    // 切换current指针
    root.current = finishedWork;

    // 阶段3: layout阶段, 调用生命周期componentDidUpdate和回调函数等
    nextEffect = firstEffect;
    do {
      commitLayoutEffects(root, lanes);
    } while (nextEffect !== null);
    nextEffect = null;
    executionContext = prevExecutionContext;
  }

  // ============ 渲染后: 重置与清理 ============
  if (rootDoesHavePassiveEffects) {
    // 有被动作用(使用useEffect), 保存一些全局变量
  } else {
    // 分解副作用队列链表, 辅助垃圾回收
    // 如果有被动作用(使用useEffect), 会把分解操作放在flushPassiveEffects函数中
    nextEffect = firstEffect;
    while (nextEffect !== null) {
      const nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;
      if (nextEffect.flags & Deletion) {
        detachFiberAfterEffects(nextEffect);
      }
      nextEffect = nextNextEffect;
    }
  }
  // 重置一些全局变量(省略这部分代码)...
  // 下面代码用于检测是否有新的更新任务
  // 比如在componentDidMount函数中, 再次调用setState()

  // 1. 检测常规(异步)任务, 如果有则会发起异步调度(调度中心`scheduler`只能异步调用)
  ensureRootIsScheduled(root, now());
  // 2. 检测同步任务, 如果有则主动调用flushSyncCallbackQueue(无需再次等待scheduler调度), 再次进入fiber树构造循环
  flushSyncCallbackQueue();

  return null;
}
```
`commitRootImpl`函数中, 可以根据是否调用渲染, 把整个`commitRootImpl`分为 3 段(分别是**渲染前**, **渲染**, **渲染**后).

#### 渲染前
为接下来正式渲染, 做一些准备工作. 主要包括:
1. 设置全局状态(如: 更新`fiberRoot`上的属性)
2. 重置全局变量(如: `workInProgressRoot`, `workInProgress`等)
3. 再次更新副作用队列: 只针对根节点`fiberRoot.finishedWork`
   - 默认情况下根节点的副作用队列是不包括自身的, 如果根节点有副作用, 则将根节点添加到副作用队列的末尾
   - 注意只是延长了副作用队列, 但是`fiberRoot.lastEffect`指针并没有改变.


#### 渲染
`commitRootImpl`函数中, 渲染阶段的主要逻辑是处理副作用队列, 将最新的 `DOM` 节点(已经在内存中, 只是还没渲染)渲染到界面上.
整个渲染过程被分为 3 个函数分布实现:
1. `commitBeforeMutationEffects`
   - `dom` 变更之前, 处理副作用队列中带有`Snapshot,Passive`标记的`fiber`节点
2. `commitMutationEffects`
   - `dom` 变更, 界面得到更新. 处理副作用队列中带有`Placement, Update, Deletion, Hydrating`标记的`fiber`节点
3. `commitLayoutEffects`
   - `dom` 变更后, 处理副作用队列中带有`Update | Callback`标记的`fiber`节点

通过上述源码分析, 可以把`commitRootImpl`的职责概括为 2 个方面:
1. 处理副作用队列. (步骤 1,2,3 都会处理, 只是处理节点的标识`fiber.flags`不同).
2. 调用渲染器, 输出最终结果. (在步骤 2: `commitMutationEffects`中执行).

所以`commitRootImpl`是处理`fiberRoot.finishedWork`这棵即将被渲染的`fiber`树, 理论上无需关心这棵`fiber`树是如何产生的(可以是首次构造产生, 也可以是对比更新产生)
这 3 个函数处理的对象是`副作用队列`和`DOM对象`

所以无论`fiber`树结构有多么复杂, 到了`commitRoot`阶段, 实际起作用的只有 2 个节点:
- 副作用队列所在节点: `根节点`, 即`HostRootFiber`节点.
- `DOM`对象所在节点: 从上至下首个`HostComponent`类型的`fiber`节点, 此节点 `fiber.stateNode`实际上指向最新的 `DOM` 树

