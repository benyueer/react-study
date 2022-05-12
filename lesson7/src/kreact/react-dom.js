function render(vNode, container) {
  console.log(vNode, container)

  // step1: vnode to dom

  const node = createNode(vNode)

  container.appendChild(node)
}

function createNode(vNode) {
  let node = null
  // vnode -> node
  const {type} = vNode

  if (typeof type === 'string') {
    node = updateHostComponent(vNode)
  } else if (typeof type === 'function') {
    node = type.prototype.isReactComponent ? updateClassComponent(vNode) : updateFunctionComponent(vNode)
  } else {
    node = updateFragment(vNode)
  }
  return node
}

// Fragment
function updateFragment(vNode) {
  const {props} = vNode
  const node = document.createDocumentFragment()
  reconcileChildren(props.children, node)
  return node
}

// 类组件
function updateClassComponent(vNode) {
  const {type, props} = vNode
  const instance = new type(props)
  const vvNode = instance.render()
  const node = createNode(vvNode)
  return node
}

// 函数组件
function updateFunctionComponent(vNode) {
  const {type, props} = vNode

  const vvNode = type(props)

  console.log(vvNode)

  const node = createNode(vvNode)

  return node
}

// 原生标签节点处理
function updateHostComponent(vNode) {
  const {type, props} = vNode
  let node = document.createElement(type)

  if (typeof props.children === 'string') {
    let childText = document.createTextNode(props.children)
    node.appendChild(childText)
  } else {
    reconcileChildren(props.children, node)
  }

  updateNode(node, props)
  return node
} 

function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(key => key !== 'children')
    .forEach(key => {
      node[key] = nextVal[key]
    })
}

function reconcileChildren(children, node) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      node.appendChild(createNode(child))
    }
  } else {
    node.appendChild(createNode(children))
  }
}

export default {render};