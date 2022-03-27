import React, { useEffect, useLayoutEffect, useReducer } from 'react'
import { counterReducer } from '../store'

export default function HooksPage() {
  // 定义修改规则，减少条件判断 useState可以实现一样的效果，useReducer的优势在于复用，复杂情况时更方便
  const initArg = (count: any) => count - 0
  const [state, dispatch] = useReducer(counterReducer, '0', initArg)

  // useEffect
  useEffect(() => {
    console.log('useEffect');
    return () => {
      console.log('will unmount');
    }
  }, [state])

  // useLayoutEffect
  useLayoutEffect(() => {
    console.log('layouteffect')
    // return () => 
  }, [state])
  return (
    <div>
      <div>HooksPage</div>
      <div>{state}</div>
      <button onClick={() => dispatch({type: 'ADD'})}>add</button>
    </div>
  )
}