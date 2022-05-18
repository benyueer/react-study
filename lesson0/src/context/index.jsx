import React from 'react'
import ContextPage from './ContextPage'
import './style.css'

/**
 * Context 用于共享对于一个组件树而言是“全局”的数据
 * 使用Context可以避免通过中间组件传递props
 */
export default function ContextView() {
  return (
    <>
      <div>Context</div>
      <ContextPage />
    </>
  )
}
