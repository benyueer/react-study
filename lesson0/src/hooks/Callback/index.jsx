import React, { useCallback, useRef, Component, PureComponent } from 'react'
import styles from '../styles.module.scss'


/**
 * 
 * PureComponent & React.memo
 * 都会在组件更新时浅比较组件的props和state是否变化，不变则不会重新渲染
 * 
 * useCallback用于“记忆”一个函数，当依赖项不变时，该函数的引用也不会改变
 * 
 * useMemo与useCallback类似，但其记忆的是函数的返回值，而不是函数本身
 * 
 * 通常这些API要配合使用·
 * 
 */

const useCacheFn = (val) => {
  const ref = useRef()
  setTimeout(() => {
    ref.current = val
  })
  return ref.current
}

export default function CallbackView() {
  const [count, setCount] = React.useState(0)
  console.log('callback render')

  const addHandler = useCallback(() => {
    setCount(preCount => preCount + 1)
  }, [])

  // const addHandler = () => {
  //   setCount(preCount => preCount + 1)·
  // }

  const cacheFn = useCacheFn(addHandler)
  console.log(cacheFn === addHandler)

  return (
    <div className={styles.border}>
      <div>CallbackView</div>
      <p>count: {count}</p>
      <Child addHandler={addHandler}></Child>
      <MemoChild addHandler={addHandler}></MemoChild>
      <ChildWithoutProps></ChildWithoutProps>
      <MemoChildWithoutProps></MemoChildWithoutProps>
      <ClassChild></ClassChild>
      <PurClassChild></PurClassChild>
    </div>
  )
}

function Child(props) {
  console.log('child render')
  return (
    <div className={styles.border}>
      <p>child</p>
      <button onClick={props.addHandler}>add</button>
    </div>
  )
}

const MemoChild = React.memo(Child)


function ChildWithoutProps() {
  console.log('childWithoutProps render')
  return (
    <div className={styles.border}>
      <p>child without props</p>
    </div>
  )
}

const MemoChildWithoutProps = React.memo(ChildWithoutProps)

class ClassChild extends Component {
  render() {
    console.log('classChild render')
    return (
      <div className={styles.border}>
        <p>class child</p>
      </div>
    )
  }
}

class PurClassChild extends PureComponent {
  render() {
    console.log('pure classChild render')
    return (
      <div className={styles.border}>
        <p>pure class child</p>
      </div>
    )
  }
}