## fiber树构造-前置知识
### 全局变量
在React运行时, `ReactFiberWorkLoop.js`闭包中的全局变量会随着`fiber`树构造循环的进行而变化, 现在查看其中重要的全局变量
```js
// 当前React的执行栈(执行上下文)
let executionContext: ExecutionContext = NoContext;

// 当前root节点
let workInProgressRoot: FiberRoot | null = null;
// 正在处理中的fiber节点
let workInProgress: Fiber | null = null;
// 正在渲染的车道(复数)
let workInProgressRootRenderLanes: Lanes = NoLanes;

// 包含所有子节点的优先级, 是workInProgressRootRenderLanes的超集
// 大多数情况下: 在工作循环整体层面会使用workInProgressRootRenderLanes, 在begin/complete阶段层面会使用 subtreeRenderLanes
let subtreeRenderLanes: Lanes = NoLanes;
// 一个栈结构: 专门存储当前节点的 subtreeRenderLanes
const subtreeRenderLanesCursor: StackCursor<Lanes> = createCursor(NoLanes);

// fiber构造完后, root节点的状态: completed, errored, suspended等
let workInProgressRootExitStatus: RootExitStatus = RootIncomplete;
// 重大错误
let workInProgressRootFatalError: mixed = null;
// 整个render期间所使用到的所有lanes
let workInProgressRootIncludedLanes: Lanes = NoLanes;
// 在render期间被跳过(由于优先级不够)的lanes: 只包括未处理的updates, 不包括被复用的fiber节点
let workInProgressRootSkippedLanes: Lanes = NoLanes;
// 在render期间被修改过的lanes
let workInProgressRootUpdatedLanes: Lanes = NoLanes;

// 防止无限循环和嵌套更新
const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount: number = 0;
let rootWithNestedUpdates: FiberRoot | null = null;

const NESTED_PASSIVE_UPDATE_LIMIT = 50;
let nestedPassiveUpdateCount: number = 0;

// 发起更新的时间
let currentEventTime: number = NoTimestamp;
let currentEventWipLanes: Lanes = NoLanes;
let currentEventPendingLanes: Lanes = NoLanes;
```

### 执行上下文
在全局变量中有`executionContext`, 代表渲染期间的执行栈(或叫做执行上下文), 它也是一个二进制表示的变量, 通过位运算进行操作. 在源码中一共定义了 8 种执行栈:
```js
type ExecutionContext = number;
export const NoContext = /*             */ 0b0000000;
const BatchedContext = /*               */ 0b0000001;
const EventContext = /*                 */ 0b0000010;
const DiscreteEventContext = /*         */ 0b0000100;
const LegacyUnbatchedContext = /*       */ 0b0001000;
const RenderContext = /*                */ 0b0010000;
const CommitContext = /*                */ 0b0100000;
```

事实上正是`executionContext`在操控`reconciler 运作流程`
```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number,
) {
  if (lane === SyncLane) {
    // legacy或blocking模式
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      performSyncWorkOnRoot(root);
    } else {
      // 后续的更新
      // 进入第2阶段, 注册调度任务
      ensureRootIsScheduled(root, eventTime);
      if (executionContext === NoContext) {
        // 如果执行上下文为空, 会取消调度任务, 手动执行回调
        // 进入第3阶段, 进行fiber树构造
        flushSyncCallbackQueue();
      }
    }
  } else {
    // concurrent模式
    // 无论是否初次更新, 都正常进入第2阶段, 注册调度任务
    ensureRootIsScheduled(root, eventTime);
  }
}
```
在 `render` 过程中, 每一个阶段都会改变`executionContext`(render 之前, 会设置`executionContext |= RenderContext`; commit 之前, 会设置`executionContext |= CommitContext`), 假设在`render`过程中再次发起更新(如在`UNSAFE_componentWillReceiveProps`生命周期中调用`setState`)则可通过`executionContext`来判断当前的`render状态`.

### 双缓冲技术(double buffering)
`fiber`树的构造过程, 就是把`ReactElement`转换成`fiber`树的过程. 在这个过程中, 内存里会同时存在 2 棵`fiber树`:
- 其一: 代表当前界面的`fiber`树(已经被展示出来, 挂载到`fiberRoot.current`上). 如果是初次构造(初始化渲染), 页面还没有渲染, 此时界面对应的 `fiber` 树为空(`fiberRoot.current = null`).
- 其二: 正在构造的`fiber`树(即将展示出来, 挂载到`HostRootFiber.alternate`上, 正在构造的节点称为`workInProgress`). 当构造完成之后, 重新渲染页面, 最后切换`fiberRoot.current = workInProgress`, 使得`fiberRoot.current`重新指向代表当前界面的fiber树.
  
用图来表述`double buffering`的概念如下:
1. 构造过程中, `fiberRoot.current`指向当前界面对应的`fiber`树.
   <img src="./imgs/fibertreecreate1-progress.png" />
2. 构造完成并渲染, 切换`fiberRoot.current`指针, 使其继续指向当前界面对应的`fiber树`(原来代表界面的 fiber 树, 变成了内存中).
   <img src="./imgs/fibertreecreate2-complete.png" />


### 优先级
在整个`react-reconciler`包中, `Lane`的应用可以分为 3 个方面:

#### update优先级(update.lane)
`update`对象是一个环形链表. 对于单个`update`对象来讲, `update.lane`代表它的优先级, 称之为`update优先级`
观察其构造函数,其优先级是由外界传入.
```js
export function createUpdate(eventTime: number, lane: Lane): Update<*> {
  const update: Update<*> = {
    eventTime,
    lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
  };
  return update;
}
```
在`React`体系中, 有 2 种情况会创建`update`对象:
1. 应用初始化: 在`react-reconciler`包中的`updateContainer`函数中
   ```js
    export function updateContainer(
      element: ReactNodeList,
      container: OpaqueRoot,
      parentComponent: ?React$Component<any, any>,
      callback: ?Function,
    ): Lane {
      const current = container.current;
      const eventTime = requestEventTime();
      const lane = requestUpdateLane(current); // 根据当前时间, 创建一个update优先级
      const update = createUpdate(eventTime, lane); // lane被用于创建update对象
      update.payload = { element };
      enqueueUpdate(current, update);
      scheduleUpdateOnFiber(current, lane, eventTime);
      return lane;
    }
   ```
2. 发起组件更新: 假设在 `class` 组件中调用`setState`
   ```js
    const classComponentUpdater = {
      isMounted,
      enqueueSetState(inst, payload, callback) {
        const fiber = getInstance(inst);
        const eventTime = requestEventTime(); // 根据当前时间, 创建一个update优先级
        const lane = requestUpdateLane(fiber); // lane被用于创建update对象
        const update = createUpdate(eventTime, lane);
        update.payload = payload;
        enqueueUpdate(fiber, update);
        scheduleUpdateOnFiber(fiber, lane, eventTime);
      },
    };
   ```
可以看到, 无论是应用初始化或者发起组件更新, 创建`update.lane`的逻辑都是一样的, 都是根据当前时间, 创建一个 `update 优先级`.

```js
export function requestUpdateLane(fiber: Fiber): Lane {
  // Special cases
  const mode = fiber.mode;
  if ((mode & BlockingMode) === NoMode) {
    // legacy 模式
    return (SyncLane: Lane);
  } else if ((mode & ConcurrentMode) === NoMode) {
    // blocking模式
    return getCurrentPriorityLevel() === ImmediateSchedulerPriority
      ? (SyncLane: Lane)
      : (SyncBatchedLane: Lane);
  }
  // concurrent模式
  if (currentEventWipLanes === NoLanes) {
    currentEventWipLanes = workInProgressRootIncludedLanes;
  }
  const isTransition = requestCurrentTransition() !== NoTransition;
  if (isTransition) {
    // 特殊情况, 处于suspense过程中
    if (currentEventPendingLanes !== NoLanes) {
      currentEventPendingLanes =
        mostRecentlyUpdatedRoot !== null
          ? mostRecentlyUpdatedRoot.pendingLanes
          : NoLanes;
    }
    return findTransitionLane(currentEventWipLanes, currentEventPendingLanes);
  }
  // 正常情况, 获取调度优先级
  const schedulerPriority = getCurrentPriorityLevel();
  let lane;
  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    schedulerPriority === UserBlockingSchedulerPriority
  ) {
    // executionContext 存在输入事件. 且调度优先级是用户阻塞性质
    lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
  } else {
    // 调度优先级转换为车道模型
    const schedulerLanePriority = schedulerPriorityToLanePriority(
      schedulerPriority,
    );
    lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
  }
  return lane;
}
```
可以看到`requestUpdateLane`的作用是返回一个合适的 `update 优先级`.
1. `legacy` 模式: 返回`SyncLane`
2. `blocking` 模式: 返回`SyncLane`
3. `concurrent` 模式
   - 正常情况下, 根据当前的`调度优先级`来生成一个`lane`.
   - 特殊情况下(处于 `suspense` 过程中), 会优先选择`TransitionLanes`通道中的空闲通道(如果所有`TransitionLanes`通道都被占用, 就取最高优先级.).

最后通过`scheduleUpdateOnFiber(current, lane, eventTime);`函数, 把`update.lane`正式带入到了`输入阶段`.
`scheduleUpdateOnFiber`是输入阶段的必经函数, 此处以`update.lane`的视角分析:
```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number,
) {
  if (lane === SyncLane) {
    // legacy或blocking模式
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root, eventTime); // 注册回调任务
      if (executionContext === NoContext) {
        flushSyncCallbackQueue(); // 取消schedule调度 ,主动刷新回调队列,
      }
    }
  } else {
    // concurrent模式
    ensureRootIsScheduled(root, eventTime);
  }
}
```
当`lane === SyncLane`也就是 `legacy` 或 `blocking` 模式中, 注册完回调任务之后(`ensureRootIsScheduled(root, eventTime)`), 如果执行上下文为空, 会取消 `schedule` 调度, 主动刷新回调队列`flushSyncCallbackQueue()`.
这里包含了一个热点问题(`setState到底是同步还是异步`)的标准答案:
- 如果逻辑进入`flushSyncCallbackQueue(executionContext === NoContext)`, 则会主动取消调度, 并刷新回调, 立即进入`fiber`树构造过程. 当执行`setState`下一行代码时, `fiber`树已经重新渲染了, 故`setState`体现为同步.
- 正常情况下, 不会取消`schedule`调度. 由于`schedule`调度是通过`MessageChannel`触发(宏任务), 故体现为异步


