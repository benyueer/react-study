## 建立调度系统
`scheduler`采用了`MessageChannel`来调度任务
```js
var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

schedulePerformWorkUntilDeadline = function () {
  port.postMessage(null);
};
```
通过`schedulePerformWorkUntilDeadline`来触发一个任务，`performWorkUntilDeadline`函数去执行当前任务队列里的任务

同时，该系统还需要几个全局API
- `unstable_now`
  获取当前时间，使用了`performance`
  ```js
  var localPerformance = performance;

  unstable_now = function () {
    return localPerformance.now();
  };
  ```
- `taskQueue`用来保存实时任务
- `timerQueue`用来保存延时任务

任务优先级：
任务分为5个优先级：
```js
var ImmediatePriority = 1; // 立即执行
var UserBlockingPriority = 2; // 250毫秒 后过期
var NormalPriority = 3;  // 5000毫秒 后过期
var LowPriority = 4; // 10000毫秒 后过期
var IdlePriority = 5; // 永不过期

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt = 1073741823; // Tasks are stored on a min heap
```

## 任务添加
一般使用`unstable_scheduleCallback`函数来添加一个任务
```js
function unstable_scheduleCallback(priorityLevel /* 任务优先级 */, callback /* 任务 */, options) {
  // 获取当前时间
  var currentTime = unstable_now();
  // 任务开始时间
  var startTime;

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    // 没有设置delay的任务立即开始
    startTime = currentTime;
  }

  var timeout;

  // 判断优先级拿到过期时间
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  // 过期时间
  var expirationTime = startTime + timeout;
  // 新建task
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    // 延时任务
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.


      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 实时任务
    newTask.sortIndex = expirationTime;
    // 向任务队列中添加任务
    push(taskQueue, newTask);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      // 通知执行任务
      requestHostCallback(flushWork);
    }
  }
  // 返回任务实例
  return newTask;
}
```


## 任务执行
添加任务后就会通知任务执行，通过`requestHostCallback`，触发`channel.port1.onmessage`
```js
function requestHostCallback(callback) {
  // callback = flushWork
  scheduledHostCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}
```

`performWorkUntilDeadline`会去清空任务队列
```js
var performWorkUntilDeadline = function () {
  if (scheduledHostCallback !== null) {
    // 获取当前时间
    var currentTime = unstable_now();
    startTime = currentTime;
    var hasTimeRemaining = true; // If a scheduler task throws, exit the current browser task so the
    var hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  } // Yielding to the browser will give it a chance to paint, so we can
};
```

`scheduledHostCallback`就是`flushWork`
```js
function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          var currentTime = unstable_now();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {

      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}
```


```js
function workLoop(hasTimeRemaining, initialTime) {
  var currentTime = initialTime;
  // 处理延时任务
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (currentTask !== null && !(enableSchedulerDebugging )) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }
    // 任务回调
    var callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      // 优先级
      currentPriorityLevel = currentTask.priorityLevel;
      // 任务是否过期
      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 执行回调
      var continuationCallback = callback(didUserCallbackTimeout);
      currentTime = unstable_now();

      if (typeof continuationCallback === 'function') {
        // 任务分片  如果任务返回值为函数，则不清除当前任务，将回调更新
        currentTask.callback = continuationCallback;
      } else {
        // 任务执行完成，移出队列
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  } // Return whether there's additional work

  if (currentTask !== null) {
    // 返回是否还有未完成的任务
    return true;
  } else {
    var firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
```

## 插队机制
不同优先级的任务执行优先级不同，高优先级的任务会优先执行，这一过程是在任务进入和离开任务队列时就完成的，使用了最小堆，以下是任务入队的过程：
任务实例生成后，会加入任务队列：
```js
push(taskQueue, newTask);
```
`push`的定义
```js
function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
```
`siftUp`会将队列中的任务按照优先级排序，使用了最小堆排序:
```js
function siftUp(heap, node, i) {
  var index = i;

  while (index > 0) {
    var parentIndex = index - 1 >>> 1;
    var parent = heap[parentIndex];

    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

// 该函数会比较两个任务的sortIndex
function compare(a, b) {
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
```
任务出堆：
```js
function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  var first = heap[0];
  var last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

// 重新构建最小堆
function siftDown(heap, node, i) {
  var index = i;
  var length = heap.length;
  var halfLength = length >>> 1;

  while (index < halfLength) {
    var leftIndex = (index + 1) * 2 - 1;
    var left = heap[leftIndex];
    var rightIndex = leftIndex + 1;
    var right = heap[rightIndex];

    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}
```