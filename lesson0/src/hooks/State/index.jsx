import React from 'react'
import ClassCompState from './ClassCompState'
import FunCompState from './FunCompState'


/**
 * 什么时候是”异步”
 * legacy模式下：命中batchedUpdates时是异步 未命中batchedUpdates时是同步的
 * concurrent模式下：都是异步的
 * 函数组件里使用useState都是异步的
 * 
 * 什么时候是同步
 * class组件原生事件触发的setState就是同步的
 * class组件在setTimeout里是同步的
 * class组件在promise.then里是同步的
 * 
 * https://www.favori.cn/react-setstate-usestate
 */

export default function StateView() {
  return (
    <>
      <div>StateView</div>
      <ClassCompState></ClassCompState>
      <FunCompState></FunCompState>
    </>
  )
}
