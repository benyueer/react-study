import React, { Component } from 'react'
import StringRef from './StringRef'
import CallbackRef from './CallbackRef'
import './style.css'
import CreateRef from './CreateRef'
import HookUseRef from './HookUseRef'
import ForwardRef from './ForwardRef'

/**
 * string类型ref，存在效率问题
 * React.createRef()，只能在类组件中使用
 * 回调ref，在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。在 componentDidMount 或 componentDidUpdate 触发前，React 会保证 refs 一定是最新的。
 * hook useRef
 * forwardRef
 */
export default class RefView extends Component {
  render() {
    return (
      <>
        <div>RefView</div>
        <StringRef />
        <CallbackRef />
        <CreateRef />
        <HookUseRef />
        <ForwardRef />
      </>
    )
  }
}
