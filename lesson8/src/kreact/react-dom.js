function render(vNode, container) {
  wipRoot = {
    stateNode: container,
    props: { children: vNode }
  }

  nextUnitOfWork = wipRoot
}

function createNode(workInProgress) {
  let node = null
  // vnode -> node
  const { type, props } = workInProgress

  if (typeof type === 'string') {
    node = document.createElement(type)
  }

  updateNode(node, props)
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
function updateClassComponent(vNode) {
  const { type, props } = vNode
  const instance = new type(props)
  const vvNode = instance.render()
  const node = createNode(vvNode)
  return node
}

// 函数组件
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress
  console.log(type, props)

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

function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .forEach(key => {
      if (key === 'children') {
        if (typeof nextVal[key] === 'string') {
          node.appendChild(document.createTextNode('' + nextVal[key]))
        }
      } else {
        node[key] = nextVal[key]
      }
    })
}

function reconcileChildren(workInProgress, children) {
  if ((workInProgress.props && typeof workInProgress.props.children === 'string')) {
    return
  }

  let previousNewFiber = null
  const newChildren = Array.isArray(children) ? children : [children]
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i]
    let newFiber = null
    newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      return: workInProgress,
      stateNode: null
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
  console.log(workInProgress)
  // * step1: run current Fiber
  const { type } = workInProgress
  console.log(type)
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
}

function commitRoot() {
  console.log(wipRoot.child)
  commitWork(wipRoot.child)
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
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode)
  }
  // * step2 commit workInProgress.child
  commitWork(workInProgress.child)
  // * step3 commit workInprogress.sibling
  commitWork(workInProgress.sibling)
}

requestIdleCallback(workLoop)

const reactDom = { render }
export default reactDom