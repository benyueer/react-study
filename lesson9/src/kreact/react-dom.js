import { DELETION, PLACEMENT, UPDATE } from "./const"

// reactDOM.render
function render(vNode, container) {
  console.log(vNode)
  // 构建根Fiber
  wipRoot = {
    stateNode: container,
    props: { children: vNode }
  }

  nextUnitOfWork = wipRoot
  deletions = []
}

// 需要删除的节点
let deletions = []

function createNode(workInProgress) {
  let node = null
  // vnode -> node
  const { type, props } = workInProgress

  if (typeof type === 'string') {
    node = document.createElement(type)
  }

  updateNode(node, {}, props)
  return node
}

// Fragment
function updateFragment(vNode) {
  const { props } = vNode
  const node = document.createDocumentFragment()
  reconcileChildren(props.children, node)
  return node
}

// 类组件
function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress
  // 创建组件
  const instance = new type(props)
  // 获取 VNODE
  const children = instance.render()
  reconcileChildren(workInProgress, children)
}

// 函数组件
function updateFunctionComponent(workInProgress) {

  wipFiber = workInProgress
  wipFiber.hooks = []
  wipFiber.hookIndex = 0

  const { type, props } = workInProgress
  // console.log(type, props)

  const children = type(props)

  reconcileChildren(workInProgress, children)
}

// 原生标签节点处理
function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress)
  }

  reconcileChildren(workInProgress, workInProgress.props.children)

}

function updateNode(node, preVal, nextVal) {
  // console.log(preVal, nextVal)
  Object.keys(preVal)
    .forEach(key => {
      if (key === 'children') {
        if (typeof preVal[key] === 'string') {
          node.innerHTML = ''
        }
      } else {
        if (key.startsWith('on')) {
          const eventName = key.toLowerCase().substring(2)
          node.removeEventListener(eventName, preVal[key])
        } else {
          if (! (key in nextVal)) {
            node[key] = ''
          }
        }
      }
    })

  Object.keys(nextVal)
    .forEach(key => {
      if (key === 'children') {
        if (typeof nextVal[key] === 'string') {
          node.innerHTML = nextVal[key]
        }
      } else {
        if (key.startsWith('on')) {
          const eventName = key.toLowerCase().substring(2)
          node.addEventListener(eventName, nextVal[key])
        }
        node[key] = nextVal[key]
      }
    })
}

function reconcileChildren(workInProgress, children) {
  // 文本节点不做处理
  if ((workInProgress.props && typeof workInProgress.props.children === 'string')) {
    return
  }

  // 上一个节点
  let previousNewFiber = null
  // children列表
  const newChildren = Array.isArray(children) ? children : [children]
  // update阶段拿到旧的Fiber
  let oldFiber = workInProgress.base?.child
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i]
    // 判断节点是否可复用
    const same = oldFiber && child && oldFiber.type === child.type
    
    let newFiber = null

    if (same) {
      // 复用
      newFiber = {
        type: child.type,
        props: {...child.props},
        child: null,
        sibling: null,
        return: workInProgress,
        stateNode: oldFiber.stateNode,
        base: oldFiber,
        effectTag: UPDATE
      }
    }

    if (!same && child) {
      // 新增
      newFiber = {
        type: child.type,
        props: {...child.props},
        child: null,
        sibling: null,
        return: workInProgress,
        stateNode: null,
        base: null,
        effectTag: PLACEMENT
      }
    }

    if (!same && oldFiber) {
      // delete
      oldFiber.effectTag = DELETION
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (i === 0) {
      workInProgress.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }

    previousNewFiber = newFiber
  }
}



/**
 * Fiber结构
 * * child 第一个子节点
 * * sibling 下一个兄弟节点
 * * return 父节点
 */

function preformUnitOfWork(workInProgress) {
  // console.log(workInProgress)
  // * step1: run current Fiber
  const { type } = workInProgress
  // console.log(type)
  if (typeof type === 'function') {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress)

  } else {
    updateHostComponent(workInProgress)
  }

  // * step2: return nuxt Fiber

  // 优先子节点
  if (workInProgress.child) {
    return workInProgress.child
  }

  // 无子节点，返回兄弟节点
  let nextFiber = workInProgress
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 没有兄弟节点
    nextFiber = nextFiber.return
  }


}

// 下一个Fiber任务
let nextUnitOfWork = null
// wip work in progress 正在进行当中的
let wipRoot = null


function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining()) {
    // 执行当前Fiber，返回下一个Fiber
    nextUnitOfWork = preformUnitOfWork(nextUnitOfWork)
  }

  if (!nextUnitOfWork && wipRoot) {
    // commit
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

let currentRoot = null

function commitRoot() {
  console.log(wipRoot)
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}


function commitWork(workInProgress) {
  if (!workInProgress) return


  // * step1 commit workInprogress
  let parentNodeFiber = workInProgress.return
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return
  }

  const parentNode = parentNodeFiber.stateNode
  if (workInProgress.stateNode && workInProgress.effectTag === PLACEMENT) {
    parentNode.appendChild(workInProgress.stateNode)
  } else if (workInProgress.stateNode && workInProgress.effectTag === UPDATE) {
    updateNode(
      workInProgress.stateNode,
      workInProgress.base.props,
      workInProgress.props
    )
  } else if(
    workInProgress.effectTag == DELETION &&
    workInProgress.stateNode
  ) {
    commitDeletion(workInProgress, parentNode)
  }


  // * step2 commit workInProgress.child
  commitWork(workInProgress.child)
  // * step3 commit workInprogress.sibling
  commitWork(workInProgress.sibling)
}

function commitDeletion(workInProgress, parentNode) {
  if (workInProgress.stateNode) {
    parentNode.removeChild(workInProgress.stateNode)
  } else {
    commitDeletion(workInProgress.child, parentNode)
  }
}

// 执行更新
requestIdleCallback(workLoop)

// 当前正在工作的Fiber
let wipFiber = null
// state  存储状态
// queue

export function useState(init) {
  const oldHook = wipFiber?.base?.hooks[wipFiber.hookIndex]
  const hook = oldHook ? {
    state: oldHook.state,
    queue: oldHook.queue
  } : { state: init, queue: [] }


  hook.queue.forEach(action => {
    hook.state = action
  })

  const setState = (action) => {

    hook.queue.push(action)
    
    wipRoot = {
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
      base: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  wipFiber.hookIndex++

  return [hook.state, setState]
}


const reactDom = { render }
export default reactDom