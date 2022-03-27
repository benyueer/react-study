import React, { useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useSelector, useDispatch } from '../kReactRedux'

export default function ReactReduxHooksPage() {
  // 获取state
  const count = useSelector((state: any) => state.count)
  // 获取dispatch
  const dispatch = useDispatch()
  const add = useCallback(() => {
    dispatch({type: 'ADD'})
  }, [])
  // console.log(213)
  return (
    <div>
      <div>ReduxHooksPage</div>
      <button onClick={add}>{count}</button>
    </div>
  )
}


